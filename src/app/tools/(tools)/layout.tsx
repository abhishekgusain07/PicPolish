'use client'
import React from 'react'
import { FloatingDock } from '@/components/ui/floating-dock'
import { AspectRatioMenu } from '@/components/ui/aspect-ratio-menu'
import { useAspectRatioStore } from '@/stores/aspect-ratio-store'
import { CopyIcon, RatioIcon, SaveIcon } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

function ToolsFloatingControls() {
  const { isMenuOpen, currentRatio, toggleMenu, setCurrentRatio, closeMenu } =
    useAspectRatioStore()

  const dockItems = [
    {
      title: 'Save',
      icon: (
        <SaveIcon className="h-full w-full text-neutral-800 dark:text-neutral-300" />
      ),
      href: '#',
    },
    {
      title: 'Copy',
      icon: (
        <CopyIcon className="h-full w-full text-neutral-800 dark:text-neutral-300" />
      ),
      href: '#',
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
