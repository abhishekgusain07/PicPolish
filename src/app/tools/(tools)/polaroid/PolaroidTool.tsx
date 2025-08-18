'use client'
import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import {
  PolaroidState,
  PolaroidToolProps,
  DEFAULT_POLAROID_STATE,
  DEFAULT_POLAROID_CONFIG,
} from '@/types/thumbnail'
import { useGenerationLimit } from '@/hooks/useGenerationLimit'
import { PolaroidImageUpload } from './components/PolaroidImageUpload'
import { PolaroidStyleSelector } from './components/PolaroidStyleSelector'
import { PolaroidEditor } from './components/PolaroidEditor'
import { PolaroidPreview } from './components/PolaroidPreview'

export function PolaroidTool({ className }: PolaroidToolProps) {
  const [polaroidState, setPolaroidState] = useState<PolaroidState>(
    DEFAULT_POLAROID_STATE
  )
  const { checkGenerationLimit, UpgradeModalComponent } = useGenerationLimit()

  // Helper function to create blob URL from file
  const createBlobUrl = useCallback((file: File): string => {
    return URL.createObjectURL(file)
  }, [])

  // Helper function to cleanup blob URL
  const cleanupBlobUrl = useCallback((url: string) => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url)
    }
  }, [])

  // Handle file upload
  const handleFileUpload = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return

      // Check generation limit before processing
      const canGenerate = await checkGenerationLimit('polaroid')
      if (!canGenerate) {
        return
      }

      const validFiles = files.filter((file) => {
        // Validate file type
        if (!DEFAULT_POLAROID_CONFIG.supportedTypes.includes(file.type)) {
          toast.error(
            `Unsupported file type: ${file.type}. Please use: ${DEFAULT_POLAROID_CONFIG.supportedTypes.join(', ')}`
          )
          return false
        }

        // Validate file size
        if (file.size > DEFAULT_POLAROID_CONFIG.maxFileSize) {
          toast.error(
            `File too large: ${file.name}. Maximum size is ${DEFAULT_POLAROID_CONFIG.maxFileSize / (1024 * 1024)}MB`
          )
          return false
        }

        return true
      })

      if (validFiles.length === 0) return

      // Limit number of files
      const filesToProcess = validFiles.slice(
        0,
        DEFAULT_POLAROID_CONFIG.maxImages
      )
      if (validFiles.length > DEFAULT_POLAROID_CONFIG.maxImages) {
        toast.warning(
          `Only first ${DEFAULT_POLAROID_CONFIG.maxImages} images will be processed`
        )
      }

      // Clean up existing blob URLs
      polaroidState.images.forEach((img) => cleanupBlobUrl(img.url))

      // Process files
      const processedImages = filesToProcess.map((file, index) => ({
        id: `img-${Date.now()}-${index}`,
        file,
        url: createBlobUrl(file),
        blob: file,
        name: file.name.split('.')[0] || `image_${index + 1}`,
      }))

      setPolaroidState({
        ...polaroidState,
        mode: 'style',
        images: processedImages,
        currentImageIndex: 0,
      })

      toast.success(`${processedImages.length} image(s) uploaded successfully!`)
    },
    [polaroidState, cleanupBlobUrl, createBlobUrl, checkGenerationLimit]
  )

  // Handle style selection
  const handleStyleSelect = useCallback((style: string) => {
    setPolaroidState((prev) => ({
      ...prev,
      style: style as any,
      mode: 'customize',
    }))
  }, [])

  // Handle back navigation
  const handleBack = useCallback(() => {
    const modes = ['upload', 'style', 'customize', 'preview']
    const currentIndex = modes.indexOf(polaroidState.mode)
    if (currentIndex > 0) {
      setPolaroidState((prev) => ({
        ...prev,
        mode: modes[currentIndex - 1] as any,
      }))
    }
  }, [polaroidState.mode])

  // Handle reset
  const handleReset = useCallback(() => {
    // Clean up blob URLs
    polaroidState.images.forEach((img) => cleanupBlobUrl(img.url))

    setPolaroidState(DEFAULT_POLAROID_STATE)
  }, [polaroidState.images, cleanupBlobUrl])

  // Render based on current mode
  const renderContent = () => {
    switch (polaroidState.mode) {
      case 'upload':
        return (
          <PolaroidImageUpload
            onFileUpload={handleFileUpload}
            config={DEFAULT_POLAROID_CONFIG}
          />
        )

      case 'style':
        return (
          <PolaroidStyleSelector
            config={DEFAULT_POLAROID_CONFIG}
            selectedStyle={polaroidState.style}
            onStyleSelect={handleStyleSelect}
            onBack={handleBack}
            imageCount={polaroidState.images.length}
          />
        )

      case 'customize':
        return (
          <PolaroidEditor
            state={polaroidState}
            setState={setPolaroidState}
            config={DEFAULT_POLAROID_CONFIG}
            onBack={handleBack}
            onNext={() =>
              setPolaroidState((prev) => ({ ...prev, mode: 'preview' }))
            }
          />
        )

      case 'preview':
        return (
          <PolaroidPreview
            state={polaroidState}
            config={DEFAULT_POLAROID_CONFIG}
            onBack={handleBack}
            onReset={handleReset}
          />
        )

      default:
        return <div>Unknown mode</div>
    }
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900 dark:to-orange-800 p-4 lg:p-6 ${className || ''}`}
    >
      {renderContent()}

      {/* Upgrade Modal */}
      {UpgradeModalComponent}
    </div>
  )
}
