import React from 'react'
import { FloatingDock } from '@/components/ui/floating-dock'
import { CopyIcon, RatioIcon, SaveIcon } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
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
      href: '#',
    },
  ]

  return (
    <div className="relative min-h-screen">
      {children}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <FloatingDock items={dockItems} />
      </div>
    </div>
  )
}

export default Layout
