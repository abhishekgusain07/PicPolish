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
      const captureElement =
        document.getElementById('ss') || document.getElementById('maindiv')

      if (!captureElement) {
        toast.error('Unable to find content to capture')
        return
      }

      toast.loading('Capturing image...')

      const imageBlob = await captureElementAsImage(captureElement, {
        format,
        quality: 0.95,
        backgroundColor: '#ffffff',
        scale: 2,
      })

      const filename = generateFileName('picpolish_export', format)
      downloadBlob(imageBlob, filename)

      toast.success(`Image saved as ${filename}`)
    } catch (error) {
      console.error('Image capture failed:', error)
      toast.error('Failed to save image. Please try again.')
    }
  }

  const handleCopyImage = async () => {
    try {
      const captureElement =
        document.getElementById('ss') || document.getElementById('maindiv')

      if (!captureElement) {
        toast.error('Unable to find content to copy')
        return
      }

      if (!navigator.clipboard?.write) {
        toast.error('Copy to clipboard is not supported in this browser')
        return
      }

      toast.loading('Copying image to clipboard...')

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

      toast.success('Image copied to clipboard!')
    } catch (error) {
      console.error('Copy to clipboard failed:', error)
      toast.error('Failed to copy image. Please try again.')
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
