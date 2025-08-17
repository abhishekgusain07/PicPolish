'use client'
import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import {
  ScreenshotState,
  ScreenshotToolProps,
  DEFAULT_SCREENSHOT_STATE,
  DEFAULT_LOCAL_CONFIG,
  CaptureType,
} from '@/types/thumbnail'
import { ImageSourceSelector } from './components/ImageSourceSelector'
import { ImagePreview } from './components/ImagePreview'
import { LocalImageEditor } from './components/LocalImageEditor'

export function ScreenshotTool({ className }: ScreenshotToolProps) {
  const [screenshotState, setScreenshotState] = useState<ScreenshotState>(
    DEFAULT_SCREENSHOT_STATE
  )
  const [usageInfo, setUsageInfo] = useState<{
    canGenerate: boolean
    plan: string
    remaining: number
  } | null>(null)

  // Helper function to create blob URL from file or blob
  const createBlobUrl = useCallback((file: File | Blob): string => {
    return URL.createObjectURL(file)
  }, [])

  // Helper function to cleanup blob URL
  const cleanupBlobUrl = useCallback((url: string) => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url)
    }
  }, [])

  // Check usage before generation
  const checkUsage = useCallback(async () => {
    try {
      const response = await fetch('/api/usage/screenshot')
      if (response.ok) {
        const data = await response.json()
        setUsageInfo({
          canGenerate: data.canGenerate,
          plan: data.usage.plan,
          remaining: data.usage.remaining,
        })
        return data.canGenerate
      }
      return false
    } catch (error) {
      console.error('Error checking usage:', error)
      return false
    }
  }, [])

  // Record generation after success
  const recordGeneration = useCallback(async (metadata?: string) => {
    try {
      const response = await fetch('/api/usage/screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metadata }),
      })
      if (response.ok) {
        const data = await response.json()
        setUsageInfo({
          canGenerate: data.usage.remaining > 0 || data.usage.plan !== 'free',
          plan: data.usage.plan,
          remaining: data.usage.remaining,
        })
      }
    } catch (error) {
      console.error('Error recording generation:', error)
    }
  }, [])

  // Handle file upload from FileUpload component
  const handleFileUpload = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return

      // Check usage before processing
      const canGenerate = await checkUsage()
      if (!canGenerate) {
        toast.error(
          "You've reached your generation limit! Upgrade to continue."
        )
        return
      }

      const file = files[0]

      // Validate file type
      if (!DEFAULT_LOCAL_CONFIG.supportedTypes.includes(file.type)) {
        toast.error(
          `Unsupported file type. Please use: ${DEFAULT_LOCAL_CONFIG.supportedTypes.join(', ')}`
        )
        return
      }

      // Validate file size
      if (file.size > DEFAULT_LOCAL_CONFIG.maxFileSize) {
        toast.error(
          `File too large. Maximum size is ${DEFAULT_LOCAL_CONFIG.maxFileSize / (1024 * 1024)}MB`
        )
        return
      }

      // Clean up previous blob URL
      if (screenshotState.imageUrl) {
        cleanupBlobUrl(screenshotState.imageUrl)
      }

      const blobUrl = createBlobUrl(file)

      setScreenshotState({
        mode: 'preview',
        imageSource: 'upload',
        imageBlob: file,
        imageUrl: blobUrl,
        filename: file.name.split('.')[0] || 'uploaded_image',
        originalFile: file,
      })

      // Record the generation
      await recordGeneration(`upload:${file.name}`)

      toast.success('Image uploaded successfully!')
    },
    [
      screenshotState.imageUrl,
      cleanupBlobUrl,
      createBlobUrl,
      checkUsage,
      recordGeneration,
    ]
  )

  // Handle screen capture
  const handleScreenCapture = useCallback(
    async (captureType: CaptureType) => {
      try {
        // Check usage before processing
        const canGenerate = await checkUsage()
        if (!canGenerate) {
          toast.error(
            "You've reached your generation limit! Upgrade to continue."
          )
          return
        }

        // Check if screen capture is supported
        if (
          !navigator.mediaDevices ||
          !navigator.mediaDevices.getDisplayMedia
        ) {
          toast.error('Screen capture is not supported in this browser')
          return
        }

        // Configure capture options based on type
        const captureOptions: DisplayMediaStreamOptions = {
          video: {
            displaySurface: captureType,
            ...(captureType === 'screen' && {
              width: { max: 1920 },
              height: { max: 1080 },
            }),
          },
          audio: false,
        }

        // Request screen capture permission
        const mediaStream =
          await navigator.mediaDevices.getDisplayMedia(captureOptions)

        // Create canvas to capture frame
        const video = document.createElement('video')
        video.srcObject = mediaStream
        video.play()

        video.onloadedmetadata = () => {
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')

          if (!context) {
            toast.error('Failed to create canvas context')
            mediaStream.getTracks().forEach((track) => track.stop())
            return
          }

          canvas.width = video.videoWidth
          canvas.height = video.videoHeight

          // Draw video frame to canvas
          context.drawImage(video, 0, 0)

          // Convert canvas to blob
          canvas.toBlob((blob) => {
            if (!blob) {
              toast.error('Failed to capture screenshot')
              mediaStream.getTracks().forEach((track) => track.stop())
              return
            }

            // Clean up previous blob URL
            if (screenshotState.imageUrl) {
              cleanupBlobUrl(screenshotState.imageUrl)
            }

            const blobUrl = createBlobUrl(blob)
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-')

            setScreenshotState({
              mode: 'preview',
              imageSource: 'capture',
              imageBlob: blob,
              imageUrl: blobUrl,
              filename: `screenshot_${timestamp}`,
            })

            // Record the generation
            recordGeneration(`capture:${captureType}:${timestamp}`)

            toast.success('Screenshot captured successfully!')

            // Stop media stream
            mediaStream.getTracks().forEach((track) => track.stop())
          }, 'image/png')
        }

        video.onerror = () => {
          toast.error('Failed to load video stream')
          mediaStream.getTracks().forEach((track) => track.stop())
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'NotAllowedError') {
          toast.error('Screen capture permission denied')
        } else {
          console.error('Screen capture error:', error)
          toast.error('Failed to capture screen')
        }
      }
    },
    [
      screenshotState.imageUrl,
      cleanupBlobUrl,
      createBlobUrl,
      checkUsage,
      recordGeneration,
    ]
  )

  // Handle edit button click
  const handleEdit = useCallback(() => {
    setScreenshotState((prev) => ({
      ...prev,
      mode: 'editing',
    }))
  }, [])

  // Handle retake/reselect
  const handleRetake = useCallback(() => {
    // Clean up blob URL
    if (screenshotState.imageUrl) {
      cleanupBlobUrl(screenshotState.imageUrl)
    }

    setScreenshotState(DEFAULT_SCREENSHOT_STATE)
  }, [screenshotState.imageUrl, cleanupBlobUrl])

  // Handle back from editor
  const handleBackFromEditor = useCallback(() => {
    setScreenshotState((prev) => ({
      ...prev,
      mode: 'preview',
    }))
  }, [])

  // Render based on current mode
  const renderContent = () => {
    switch (screenshotState.mode) {
      case 'select':
        return (
          <ImageSourceSelector
            onFileUpload={handleFileUpload}
            onScreenCapture={handleScreenCapture}
          />
        )

      case 'preview':
        if (!screenshotState.imageUrl) {
          return <div>Error: No image to preview</div>
        }
        return (
          <ImagePreview
            imageUrl={screenshotState.imageUrl}
            filename={screenshotState.filename}
            fileSize={screenshotState.originalFile?.size}
            fileType={screenshotState.originalFile?.type}
            onEdit={handleEdit}
            onRetake={handleRetake}
          />
        )

      case 'editing':
        if (!screenshotState.imageUrl) {
          return <div>Error: No image to edit</div>
        }
        return (
          <LocalImageEditor
            imageUrl={screenshotState.imageUrl}
            filename={screenshotState.filename}
            onBack={handleBackFromEditor}
            config={DEFAULT_LOCAL_CONFIG}
          />
        )

      default:
        return <div>Unknown mode</div>
    }
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 lg:p-6 ${className || ''}`}
    >
      {renderContent()}
    </div>
  )
}

// ⏺ Update Todos
//   ⎿  ☒ Phase 1: Database schema changes - Add generations table and free plan
//      ☐ Phase 2: Usage tracking system - Modify API routes and hooks
//      ☐ Phase 3: tRPC integration - Create usage router and update billing
//      ☐ Phase 4: Enforcement layer - Add generation limits and validation
//      ☐ Phase 5: UI/UX enhancements - Usage indicators and upgrade modals
