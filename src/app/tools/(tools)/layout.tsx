'use client'
import React from 'react'
import { FloatingDock } from '@/components/ui/floating-dock'
import { AspectRatioMenu } from '@/components/ui/aspect-ratio-menu'
import {
  AspectRatioProvider,
  useAspectRatio,
} from '@/contexts/aspect-ratio-context'
import { CopyIcon, RatioIcon, SaveIcon } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

function ToolsFloatingControls() {
  const { aspectRatioState, toggleMenu, setCurrentRatio, closeMenu } =
    useAspectRatio()

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
        isOpen={aspectRatioState.isMenuOpen}
        onClose={closeMenu}
        onSelect={setCurrentRatio}
        currentRatio={aspectRatioState.currentRatio}
      />
    </>
  )
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <AspectRatioProvider>
      <div className="relative min-h-screen">
        {children}
        <ToolsFloatingControls />
      </div>
    </AspectRatioProvider>
  )
}

export default Layout
