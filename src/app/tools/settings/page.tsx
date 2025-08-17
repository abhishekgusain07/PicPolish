'use client'

import DuolingoBadge from '@/components/ui/duolingo-badge'
import DuolingoButton from '@/components/ui/duolingo-button'
import { Progress } from '@/components/ui/progress'
import { UpgradeDrawer } from '@/components/upgrade-drawer'
import { authClient } from '@/lib/auth-client'
import { trpc } from '@/trpc/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

const Page = () => {
  const router = useRouter()
  const { data } = authClient.useSession()

  const searchParams = useSearchParams()
  const status = searchParams.get('s')

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/')
        },
      },
    })
  }

  const { data: subscription } = trpc.billing.getCurrentSubscription.useQuery()

  useEffect(() => {
    if (status) {
      if (status === 'cancelled') {
        router.push('/tools/settings')
        return
      }

      if (status === 'processing') {
        if (subscription?.currentPlan === 'pro') {
          toast.success('Upgraded to pro.')
          router.push('/tools/settings')
          return
        }

        return
      }
    }
  }, [subscription, status, router])

  const {
    mutate: createBillingPortalUrl,
    isPending: isCreatingBillingPortalUrl,
  } = trpc.billing.openCustomerPortal.useMutation({
    onSuccess: ({ url }) => {
      router.push(url)
    },
    onError: (error) => {
      console.error(error)
      toast.error('Something went wrong, please try again.')
    },
  })

  // Format usage data for display
  const currentPlan = subscription?.currentPlan || 'free'
  const usageData = subscription?.currentUsage || {
    users: 1,
    projects: 0,
    apiCalls: 0,
    generations: 0,
  }
  const planLimits = subscription?.planLimits || {
    maxUsers: 1,
    maxProjects: 3,
    maxApiCalls: 100,
    maxGenerations: 5,
  }

  const apiUsagePercentage =
    planLimits.maxApiCalls === -1
      ? 0
      : (usageData.apiCalls / planLimits.maxApiCalls) * 100

  const generationsUsagePercentage =
    planLimits.maxGenerations === -1
      ? 0
      : (usageData.generations / planLimits.maxGenerations) * 100

  return (
    <div className="relative w-full max-w-md mx-auto mt-12">
      <div className="relative w-full flex flex-col gap-6 bg-white/90 shadow-xl rounded-2xl z-10 py-10 px-6 md:px-12">
        <div className="flex flex-col items-center w-full gap-6 bg-light-gray rounded-lg p-5">
          {/* user card */}
          <div className="flex flex-col gap-2 items-center">
            <div className="mb-1 flex flex-col items-center">
              <p className="text-2xl font-semibold text-gray-900">
                {data?.user.name}
              </p>
              <p className="text-sm text-gray-500">{data?.user.email}</p>
            </div>
            <DuolingoBadge className="mb-6 px-3">
              {currentPlan === 'free' ? 'Free Plan' : 'Pro Plan'}
            </DuolingoBadge>
          </div>

          {/* generations usage card */}
          <div className="bg-white shadow-sm rounded-xl p-3 w-full">
            <div className="flex flex-col justify-between text-sm mb-3">
              <span className="font-medium text-gray-900">Generations</span>
              <span className="text-xs text-gray-400 mt-1">
                {planLimits.maxGenerations === -1
                  ? 'Usage statistics'
                  : 'Total generations used'}
              </span>
            </div>

            {planLimits.maxGenerations !== -1 && (
              <div className="w-full mb-3">
                <Progress value={generationsUsagePercentage} />
              </div>
            )}

            <div className="text-sm">
              {planLimits.maxGenerations === -1 ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total generated:</span>
                    <span className="font-medium">{usageData.generations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan limit:</span>
                    <span className="font-medium text-green-600">
                      Unlimited
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-400">
                  {usageData.generations}/{planLimits.maxGenerations}{' '}
                  generations remaining
                </div>
              )}
            </div>

            <div className="flex flex-col items-center justify-center gap-2 mt-4">
              {currentPlan === 'free' ? (
                <p className="text-sm opacity-60">
                  Get unlimited access to Beautify for $20/mo - cancel anytime.
                </p>
              ) : null}
              {currentPlan === 'free' ? <UpgradeDrawer /> : null}
              {currentPlan === 'pro' ? (
                <DuolingoButton
                  onClick={() => createBillingPortalUrl()}
                  loading={isCreatingBillingPortalUrl}
                >
                  Manage plan
                </DuolingoButton>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <p
            onClick={handleLogout}
            className="underline cursor-pointer underline-offset-2 text-gray-600 hover:text-gray-800"
          >
            Sign out
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page
