import { useCallback } from 'react'
import { toast } from 'sonner'
import { PlatformConfig, ApiResponse } from '@/types/thumbnail'

interface UseThumbnailApiProps {
  config: PlatformConfig
  updateImageState: (updates: {
    url?: string
    isLoading?: boolean
    error?: boolean
  }) => void
}

export function useThumbnailApi({
  config,
  updateImageState,
}: UseThumbnailApiProps) {
  const validateUrl = useCallback(
    (url: string): boolean => {
      if (!url.trim()) return false

      try {
        const urlObj = new URL(url)

        // Check if URL pattern matches (if provided)
        if (config.validationRules?.urlPattern) {
          if (!config.validationRules.urlPattern.test(url)) {
            return false
          }
        }

        // Check if required domain matches (if provided)
        if (config.validationRules?.requiredDomain) {
          if (
            !urlObj.hostname.includes(config.validationRules.requiredDomain)
          ) {
            return false
          }
        }

        return true
      } catch {
        return false
      }
    },
    [config.validationRules]
  )

  const fetchThumbnail = useCallback(
    async (inputUrl: string): Promise<void> => {
      if (!validateUrl(inputUrl)) {
        toast.error(`Please enter a valid ${config.name} URL`)
        return
      }

      updateImageState({ isLoading: true, error: false })

      try {
        const response = await fetch(config.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ videoUrl: inputUrl }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: ApiResponse = await response.json()

        // Try different thumbnail qualities in order of preference
        const thumbnailUrl =
          data.thumbnails?.maxresolution ||
          data.thumbnails?.maxres ||
          data.thumbnails?.standard ||
          data.thumbnails?.high ||
          data.thumbnails?.medium ||
          data.thumbnails?.default

        if (!thumbnailUrl) {
          throw new Error('No thumbnail found in response')
        }

        updateImageState({
          url: thumbnailUrl,
          isLoading: false,
          error: false,
        })

        toast.success(`${config.name} thumbnail loaded successfully!`)
      } catch (error) {
        console.error('Error fetching thumbnail:', error)
        updateImageState({ isLoading: false, error: true })
        toast.error(`Error fetching ${config.name} thumbnail`)
      }
    },
    [config, updateImageState, validateUrl]
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
