'use client'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { trpc } from '@/trpc/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import DuolingoButton from './ui/duolingo-button'
import { checkout } from '@/lib/auth-client'

const features = [
  'Unlimited thumbnail generations',
  'Priority processing',
  'Advanced editing tools',
  'Premium templates',
  'Commercial usage rights',
  'Priority support',
]

export const UpgradeDrawer = () => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const { mutate: handleSubscribe, isPending } =
    trpc.billing.openCustomerPortal.useMutation({
      onSuccess: async ({ url, isCheckout }) => {
        if (!url) {
          toast.error('No checkout session could be created')
          return
        }

        setIsOpen(false)

        if (isCheckout) {
          // If this is a checkout flow (no existing subscription), use the checkout function
          try {
            await checkout({
              slug: 'pro', // Default to pro plan
            })
          } catch (error: any) {
            console.error('Checkout error:', error)
            toast.error(error?.message || 'Failed to start checkout process')
          }
        } else {
          // If user has subscription, redirect to customer portal
          router.push(url)
        }
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to create checkout session')
      },
    })

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <DuolingoButton size="sm" className="w-full gap-1.5">
          Get Pro
        </DuolingoButton>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerClose />
        <div className="mx-auto w-full max-w-lg p-4">
          <DrawerHeader className="flex flex-col">
            <DrawerTitle className="text-2xl tracking-tight">
              Beautify Pro
            </DrawerTitle>
            <DrawerDescription className="text-base text-pretty">
              Unlock unlimited thumbnail generation and advanced features
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col px-4 gap-6">
            <div className="flex flex-col gap-2">
              <ul>
                {features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-start gap-1.5"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-indigo-500"
                    >
                      <circle cx="4" cy="4" r="4" fill="currentColor" />
                    </svg>
                    <p className="text-gray-700">{feature}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-x-2">
              <h2 className="text-3xl flex gap-x-8 text-text-primary">$20</h2>
              <div className="gap-y-2 flex flex-col justify-center">
                <h3 className="text-xs leading-[0.7] opacity-60">per month</h3>
                <h3 className="text-xs leading-[0.7] opacity-60">
                  billed monthly
                </h3>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <div className="flex gap-2 items-center justify-between">
              <DuolingoButton
                size="sm"
                className="h-12"
                loading={isPending}
                onClick={() => handleSubscribe()}
              >
                Get Pro
              </DuolingoButton>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
