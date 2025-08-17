'use client'
import React, { useState } from 'react'
import { FloatingDock } from '@/components/ui/floating-dock'
import { AspectRatioMenu } from '@/components/ui/aspect-ratio-menu'
import { SaveImageModal } from '@/components/ui/save-image-modal'
import { useAspectRatioStore } from '@/stores/aspect-ratio-store'
import { CopyIcon, RatioIcon, SaveIcon } from 'lucide-react'
import {
  captureElementAsImage,
  downloadBlob,
  generateFileName,
  ImageFormat,
} from '@/lib/image-utils'
import { toast } from 'sonner'

interface LayoutProps {
  children: React.ReactNode
}

function ToolsFloatingControls() {
  const { isMenuOpen, currentRatio, toggleMenu, setCurrentRatio, closeMenu } =
    useAspectRatioStore()
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  const handleSaveImage = async (format: ImageFormat) => {
    try {
      console.log('Starting image save process with format:', format)

      // Try to find the capture element in order of preference
      const captureElement =
        document.getElementById('thumbnail-container') || // Primary target - thumbnail preview
        document.getElementById('ss') || // YouTube tool
        document.getElementById('maindiv') || // Other tools
        document.querySelector('[id*="thumbnail"]') || // Any element with thumbnail in ID
        document.querySelector('.thumbnail') || // Any element with thumbnail class
        document.querySelector('main') // Last resort

      if (!captureElement) {
        toast.error('Unable to find content to capture')
        return
      }

      console.log(
        'Found capture element:',
        captureElement.id || captureElement.className
      )

      toast.loading('Capturing image...', { id: 'capture-toast' })

      const imageBlob = await captureElementAsImage(captureElement, {
        format,
        quality: 0.95,
        backgroundColor: '#ffffff',
        scale: 2,
      })

      const filename = generateFileName('picpolish_export', format)
      downloadBlob(imageBlob, filename)

      toast.success(`Image saved as ${filename}`, { id: 'capture-toast' })
    } catch (error) {
      console.error('Image capture failed:', error)
      toast.error('Failed to save image. Please try again.', {
        id: 'capture-toast',
      })
    }
  }

  const handleCopyImage = async () => {
    try {
      console.log('Starting image copy to clipboard')

      // Use same element selection logic as save
      const captureElement =
        document.getElementById('thumbnail-container') ||
        document.getElementById('ss') ||
        document.getElementById('maindiv') ||
        document.querySelector('[id*="thumbnail"]') ||
        document.querySelector('.thumbnail') ||
        document.querySelector('main')

      if (!captureElement) {
        toast.error('Unable to find content to copy')
        return
      }

      if (!navigator.clipboard?.write) {
        toast.error('Copy to clipboard is not supported in this browser')
        return
      }

      console.log(
        'Copying element:',
        captureElement.id || captureElement.className
      )

      toast.loading('Copying image to clipboard...', { id: 'copy-toast' })

      const imageBlob = await captureElementAsImage(captureElement, {
        format: 'png',
        quality: 0.95,
        backgroundColor: '#ffffff',
        scale: 2,
      })

      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': imageBlob,
        }),
      ])

      toast.success('Image copied to clipboard!', { id: 'copy-toast' })
    } catch (error) {
      console.error('Copy to clipboard failed:', error)
      toast.error('Failed to copy image. Please try again.', {
        id: 'copy-toast',
      })
    }
  }

  const dockItems = [
    {
      title: 'Save',
      icon: (
        <SaveIcon className="h-full w-full text-neutral-800 dark:text-neutral-300" />
      ),
      onClick: () => setIsImageModalOpen(true),
    },
    {
      title: 'Copy',
      icon: (
        <CopyIcon className="h-full w-full text-neutral-800 dark:text-neutral-300" />
      ),
      onClick: handleCopyImage,
    },
    {
      title: 'Aspect Ratio',
      icon: (
        <RatioIcon className="h-full w-full text-neutral-800 dark:text-neutral-300" />
      ),
      onClick: toggleMenu,
    },
  ]

  return (
    <>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <FloatingDock items={dockItems} />
      </div>

      <AspectRatioMenu
        isOpen={isMenuOpen}
        onClose={closeMenu}
        onSelect={setCurrentRatio}
        currentRatio={currentRatio}
      />

      <SaveImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onSave={handleSaveImage}
      />
    </>
  )
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative min-h-screen">
      {children}
      <ToolsFloatingControls />
    </div>
  )
}

export default Layout
