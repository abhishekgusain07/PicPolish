import { useCallback } from 'react'
import { toast } from 'sonner'
import { PlatformConfig, ApiResponse } from '@/types/thumbnail'
import { UsageService } from '@/lib/usage'

interface UseThumbnailApiProps {
  config: PlatformConfig
  updateImageState: (updates: {
    url?: string
    isLoading?: boolean
    error?: boolean
    tweetData?: Record<string, unknown>
    usage?: {
      plan: string
      remaining: number
    }
  }) => void
}

export function useThumbnailApi({
  config,
  updateImageState,
}: UseThumbnailApiProps) {
  const validateUrl = useCallback(
    (url: string): boolean => {
      console.log('Validating URL:', url)
      if (!url.trim()) {
        console.log('URL is empty')
        return false
      }

      try {
        const urlObj = new URL(url)
        console.log('Parsed URL hostname:', urlObj.hostname)

        // Check if URL pattern matches (if provided)
        if (config.validationRules?.urlPattern) {
          const patternMatch = config.validationRules.urlPattern.test(url)
          console.log('URL pattern test result:', patternMatch)
          if (!patternMatch) {
            return false
          }
        }

        // Check if required domain matches (if provided)
        if (config.validationRules?.requiredDomain) {
          const domainMatch = urlObj.hostname.includes(
            config.validationRules.requiredDomain
          )
          console.log('Domain match result:', domainMatch)
          if (!domainMatch) {
            return false
          }
        }

        console.log('URL validation passed')
        return true
      } catch (error) {
        console.log('URL validation error:', error)
        return false
      }
    },
    [config.validationRules]
  )

  const extractTweetId = useCallback((url: string): string | null => {
    try {
      // Handle both twitter.com and x.com URLs
      const patterns = [
        /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/,
        /(?:twitter\.com|x\.com)\/\w+\/statuses\/(\d+)/,
        /(?:twitter\.com|x\.com)\/i\/web\/status\/(\d+)/,
      ]

      for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) {
          return match[1]
        }
      }
      return null
    } catch {
      return null
    }
  }, [])

  const fetchThumbnail = useCallback(
    async (inputUrl: string): Promise<void> => {
      console.log('fetchThumbnail called with URL:', inputUrl)

      if (!validateUrl(inputUrl)) {
        console.log('URL validation failed for:', inputUrl)
        toast.error(`Please enter a valid ${config.name} URL`)
        return
      }

      console.log('URL validation passed, starting fetch...')
      updateImageState({ isLoading: true, error: false })

      try {
        let requestBody: Record<string, unknown>

        // Handle Twitter URLs differently
        if (config.name === 'Twitter') {
          const tweetId = extractTweetId(inputUrl)
          if (!tweetId) {
            throw new Error('Could not extract tweet ID from URL')
          }
          requestBody = { tweetId }
        } else {
          // For other platforms (YouTube, etc.)
          requestBody = { videoUrl: inputUrl }
        }

        const response = await fetch(config.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        })

        if (!response.ok) {
          if (response.status === 403) {
            const errorData = await response.json()
            if (errorData.upgradeRequired) {
              toast.error(
                `You've reached your ${config.name} generation limit! Upgrade to continue.`
              )
              updateImageState({
                isLoading: false,
                error: true,
                usage: {
                  plan: errorData.plan,
                  remaining: 0,
                },
              })
              return
            }
          }
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: Record<string, unknown> = await response.json()

        let thumbnailUrl: string | null = null

        // Extract usage info from response
        const usage = (data as any).usage

        // Handle Twitter response format
        if (config.name === 'Twitter') {
          // For Twitter, we need to render the tweet data as an image
          // The API returns tweet data, not a direct thumbnail URL
          // We'll set a special flag to indicate tweet data is loaded
          updateImageState({
            url: 'twitter-data-loaded', // Special flag
            isLoading: false,
            error: false,
            tweetData: data, // Store tweet data for rendering
            usage,
          })
          toast.success(`${config.name} data loaded successfully!`)
          return
        } else {
          // Handle YouTube/other platforms with thumbnail URLs
          const apiResponse = data as ApiResponse
          thumbnailUrl =
            apiResponse.thumbnails?.maxresolution ||
            apiResponse.thumbnails?.maxres ||
            apiResponse.thumbnails?.standard ||
            apiResponse.thumbnails?.high ||
            apiResponse.thumbnails?.medium ||
            apiResponse.thumbnails?.default
        }

        if (!thumbnailUrl) {
          throw new Error('No thumbnail found in response')
        }

        updateImageState({
          url: thumbnailUrl,
          isLoading: false,
          error: false,
          usage,
        })

        toast.success(`${config.name} thumbnail loaded successfully!`)
      } catch (error) {
        console.error('Error fetching thumbnail:', error)
        updateImageState({ isLoading: false, error: true })
        toast.error(`Error fetching ${config.name} thumbnail`)
      }
    },
    [config, updateImageState, validateUrl, extractTweetId]
  )

  const resetImage = useCallback(() => {
    updateImageState({
      url: '',
      isLoading: true,
      error: false,
    })
  }, [updateImageState])

  return {
    fetchThumbnail,
    resetImage,
    validateUrl,
  }
}
