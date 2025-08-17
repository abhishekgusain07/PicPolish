'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import DuolingoButton from '@/components/ui/duolingo-button'
import { trpc } from '@/trpc/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { X, Sparkles, Zap, Crown, CheckCircle } from 'lucide-react'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  plan?: string
  usedGenerations?: number
  maxGenerations?: number
  feature?: string
}

const features = [
  { icon: <Sparkles className="w-4 h-4" />, text: 'Unlimited generations' },
  { icon: <Zap className="w-4 h-4" />, text: 'Priority processing' },
  { icon: <Crown className="w-4 h-4" />, text: 'Advanced editing tools' },
  { icon: <CheckCircle className="w-4 h-4" />, text: 'Priority support' },
]

export function UpgradeModal({
  isOpen,
  onClose,
  plan = 'free',
  usedGenerations = 5,
  maxGenerations = 5,
  feature = 'generations',
}: UpgradeModalProps) {
  const router = useRouter()
  const [isUpgrading, setIsUpgrading] = useState(false)

  const usagePercentage = Math.min(
    (usedGenerations / maxGenerations) * 100,
    100
  )

  const { mutate: handleUpgrade } = trpc.billing.openCustomerPortal.useMutation(
    {
      onSuccess: ({ url }) => {
        if (!url) {
          toast.error('Unable to create checkout session')
          return
        }
        setIsUpgrading(true)
        router.push(url)
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to start upgrade process')
        setIsUpgrading(false)
      },
    }
  )

  // Reset upgrading state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsUpgrading(false)
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-white border-0 shadow-2xl">
        {/* High blur overlay is handled by DialogOverlay */}
        <div className="relative">
          {/* Close button */}
          <button
            onClick={onClose}
            disabled={isUpgrading}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>

          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 pb-4">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center text-gray-900 mb-2">
                🚀 You&apos;ve reached your limit!
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600 text-base">
                Upgrade to Pro and continue creating without limits
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Content */}
          <div className="p-6 pt-4 space-y-6">
            {/* Usage Progress */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Generations Used
                </span>
                <span className="text-sm font-bold text-indigo-600">
                  {usedGenerations}/{maxGenerations}
                </span>
              </div>
              <Progress value={usagePercentage} className="h-3 bg-gray-100" />
              <p className="text-xs text-gray-500 text-center">
                You&apos;ve used all your {plan} plan {feature}
              </p>
            </div>

            {/* Pricing highlight */}
            <div className="text-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl font-bold text-indigo-600">$20</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-sm text-gray-600">
                Cancel anytime • No setup fees
              </p>
            </div>

            {/* Features grid */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 text-center">
                Upgrade to Pro and get:
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100"
                  >
                    <div className="text-green-600 flex-shrink-0">
                      {feature.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <DuolingoButton
                variant="secondary"
                size="md"
                onClick={onClose}
                disabled={isUpgrading}
                className="flex-1"
              >
                Maybe Later
              </DuolingoButton>
              <DuolingoButton
                variant="primary"
                size="md"
                onClick={() => handleUpgrade()}
                disabled={isUpgrading}
                loading={isUpgrading}
                className="flex-1"
              >
                {isUpgrading ? 'Redirecting...' : 'Upgrade Now'}
              </DuolingoButton>
            </div>

            {/* Trust indicators */}
            <div className="text-center pt-2">
              <p className="text-xs text-gray-500">
                🔒 Secure payment • 💳 Cancel anytime • ⚡ Instant activation
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
