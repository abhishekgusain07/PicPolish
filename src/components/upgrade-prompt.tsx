'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { UpgradeDrawer } from './upgrade-drawer'
import { Progress } from '@/components/ui/progress'

interface UpgradePromptProps {
  isOpen: boolean
  onClose: () => void
  plan: string
  usedGenerations: number
  maxGenerations: number
}

export function UpgradePrompt({
  isOpen,
  onClose,
  plan,
  usedGenerations,
  maxGenerations,
}: UpgradePromptProps) {
  const usagePercentage = (usedGenerations / maxGenerations) * 100

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            🚀 You&apos;ve reached your {plan} plan limit!
          </DialogTitle>
          <DialogDescription className="text-center">
            Upgrade to continue using all features without limits
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Usage Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Generations Used</span>
              <span>
                {usedGenerations}/{maxGenerations}
              </span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
          </div>

          {/* Upgrade Benefits */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-center mb-2">
              Upgrade to Pro and get:
            </h4>
            <ul className="space-y-1 text-sm">
              <li>✨ Unlimited generations</li>
              <li>🚀 Priority processing</li>
              <li>🎨 Advanced editing tools</li>
              <li>📞 Priority support</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Maybe Later
            </Button>
            <div className="flex-1">
              <UpgradeDrawer />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Hook to use the upgrade prompt
export function useUpgradePrompt() {
  const [isOpen, setIsOpen] = useState(false)

  const showUpgradePrompt = () => setIsOpen(true)
  const hideUpgradePrompt = () => setIsOpen(false)

  return {
    isOpen,
    showUpgradePrompt,
    hideUpgradePrompt,
    UpgradePromptComponent: UpgradePrompt,
  }
}
