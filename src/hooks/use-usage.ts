import { useState, useEffect, useCallback } from 'react'
import { trpc } from '@/trpc/react'
import { toast } from 'sonner'

export interface UsageState {
  plan: string
  totalGenerations: number
  remaining: number
  canGenerate: boolean
  isLoading: boolean
  error: string | null
}

export function useUsage() {
  const [usageState, setUsageState] = useState<UsageState>({
    plan: 'free',
    totalGenerations: 0,
    remaining: 5,
    canGenerate: true,
    isLoading: true,
    error: null,
  })

  // Get usage stats using tRPC
  const {
    data: usageStats,
    isLoading,
    error,
    refetch: refetchUsage,
  } = trpc.usage.getUsageStats.useQuery()

  // Update local state when data changes
  useEffect(() => {
    if (usageStats) {
      setUsageState({
        plan: usageStats.plan,
        totalGenerations: usageStats.totalGenerations,
        remaining: usageStats.remaining,
        canGenerate: usageStats.canGenerate,
        isLoading: false,
        error: null,
      })
    } else if (error) {
      setUsageState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }))
    }
  }, [usageStats, error])

  // Check if user can generate for a specific platform
  const checkCanGenerate = useCallback(
    async (
      platform: 'screenshot' | 'twitter' | 'youtube'
    ): Promise<boolean> => {
      try {
        const result = await trpc.usage.canGenerate.query({ platform })
        return result.canGenerate
      } catch (error) {
        console.error('Error checking generation capability:', error)
        return false
      }
    },
    []
  )

  // Record a generation (for client-side tools like screenshot)
  const recordGeneration = useCallback(
    async (
      platform: 'screenshot' | 'twitter' | 'youtube',
      metadata?: string
    ) => {
      try {
        const result = await trpc.usage.recordGeneration.mutate({
          platform,
          metadata,
        })

        // Update local state
        setUsageState((prev) => ({
          ...prev,
          totalGenerations: prev.totalGenerations + 1,
          remaining: result.usage.remaining,
          canGenerate:
            result.usage.remaining > 0 || result.usage.plan !== 'free',
        }))

        // Refetch to get accurate data
        refetchUsage()

        return result
      } catch (error: any) {
        console.error('Error recording generation:', error)

        if (error.message?.includes('limit exceeded')) {
          toast.error('Generation limit exceeded! Upgrade to continue.')
          setUsageState((prev) => ({
            ...prev,
            canGenerate: false,
            remaining: 0,
          }))
        }

        throw error
      }
    },
    [refetchUsage]
  )

  // Show upgrade prompt
  const showUpgradePrompt = useCallback(() => {
    toast.error(
      `You've reached your ${usageState.plan} plan limit! Upgrade to continue generating.`,
      {
        action: {
          label: 'Upgrade',
          onClick: () => {
            window.open('/pricing', '_blank')
          },
        },
      }
    )
  }, [usageState.plan])

  // Refresh usage data
  const refreshUsage = useCallback(() => {
    refetchUsage()
  }, [refetchUsage])

  return {
    ...usageState,
    checkCanGenerate,
    recordGeneration,
    showUpgradePrompt,
    refreshUsage,
    isLoading,
  }
}
