'use client'

import React, { useState, useCallback } from 'react'
import { trpc } from '@/trpc/react'
import { UpgradeModal } from '@/components/UpgradeModal'

interface GenerationLimitState {
  isModalOpen: boolean
  plan: string
  usedGenerations: number
  maxGenerations: number
  canGenerate: boolean
  isLoading: boolean
}

interface UseGenerationLimitReturn {
  state: GenerationLimitState
  checkGenerationLimit: (
    platform: 'screenshot' | 'twitter' | 'youtube'
  ) => Promise<boolean>
  showUpgradeModal: () => void
  hideUpgradeModal: () => void
  UpgradeModalComponent: React.ReactNode
  refreshUsage: () => void
}

export function useGenerationLimit(): UseGenerationLimitReturn {
  const [state, setState] = useState<GenerationLimitState>({
    isModalOpen: false,
    plan: 'free',
    usedGenerations: 0,
    maxGenerations: 5,
    canGenerate: true,
    isLoading: false,
  })

  // Get usage stats using tRPC
  const {
    data: usageStats,
    isLoading: usageLoading,
    refetch: refetchUsage,
  } = trpc.usage.getUsageStats.useQuery(undefined, {
    refetchOnWindowFocus: false,
  })

  // Update state when usage data changes
  React.useEffect(() => {
    if (usageStats) {
      setState((prev) => ({
        ...prev,
        plan: usageStats.plan,
        usedGenerations: usageStats.totalGenerations,
        maxGenerations: usageStats.limit === -1 ? Infinity : usageStats.limit,
        canGenerate: usageStats.canGenerate,
        isLoading: usageLoading,
      }))
    }
  }, [usageStats, usageLoading])

  // Create tRPC client instance for imperativ calls
  const trpcClient = trpc.useUtils()

  // Check if user can generate for a specific platform
  const checkGenerationLimit = useCallback(
    async (
      platform: 'screenshot' | 'twitter' | 'youtube'
    ): Promise<boolean> => {
      setState((prev) => ({ ...prev, isLoading: true }))

      try {
        const result = await trpcClient.usage.canGenerate.fetch({ platform })

        const updatedState = {
          plan: result.plan,
          usedGenerations: state.maxGenerations - result.remaining,
          maxGenerations: result.plan === 'free' ? 5 : Infinity,
          canGenerate: result.canGenerate,
          isLoading: false,
        }

        setState((prev) => ({
          ...prev,
          ...updatedState,
        }))

        // If user cannot generate, show the upgrade modal
        if (!result.canGenerate) {
          setState((prev) => ({
            ...prev,
            isModalOpen: true,
          }))
          return false
        }

        return true
      } catch (error) {
        console.error('Error checking generation limit:', error)
        setState((prev) => ({ ...prev, isLoading: false }))
        return false
      }
    },
    [state.maxGenerations, trpcClient]
  )

  const showUpgradeModal = useCallback(() => {
    setState((prev) => ({ ...prev, isModalOpen: true }))
  }, [])

  const hideUpgradeModal = useCallback(() => {
    setState((prev) => ({ ...prev, isModalOpen: false }))
  }, [])

  const refreshUsage = useCallback(() => {
    refetchUsage()
  }, [refetchUsage])

  // Modal component
  const UpgradeModalComponent = (
    <UpgradeModal
      isOpen={state.isModalOpen}
      onClose={hideUpgradeModal}
      plan={state.plan}
      usedGenerations={state.usedGenerations}
      maxGenerations={
        state.maxGenerations === Infinity ? 5 : state.maxGenerations
      }
      feature="generations"
    />
  )

  return {
    state,
    checkGenerationLimit,
    showUpgradeModal,
    hideUpgradeModal,
    UpgradeModalComponent,
    refreshUsage,
  }
}
