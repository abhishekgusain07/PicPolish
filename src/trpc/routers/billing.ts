import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { eq, desc } from 'drizzle-orm'
import { db } from '@/db'
import { subscription } from '@/db/schema'
import { getUserPlan, getPlanLimits, PRICING_PLANS } from '@/lib/plans'
import { UsageService } from '@/lib/usage'
import { createCustomerSafely } from '@/lib/polar/customer-service'
import { createTRPCRouter, protectedProcedure } from '../init'

export const billingRouter = createTRPCRouter({
  // Get current user's subscription and billing data
  getCurrentSubscription: protectedProcedure.query(async ({ ctx }) => {
    try {
      // Ensure user has a Polar customer (create if needed)
      try {
        await createCustomerSafely(ctx.user.id, ctx.user.email, ctx.user.name)
      } catch (error) {
        console.error('❌ Failed to ensure Polar customer exists:', error)
        // Continue even if customer creation fails
      }

      // Fetch subscription from database
      const userSubscription = await db
        .select()
        .from(subscription)
        .where(eq(subscription.userId, ctx.user.id))
        .orderBy(desc(subscription.createdAt))
        .limit(1)
        .then((rows) => rows[0] || null)

      // Get plan information
      const currentPlan = getUserPlan(userSubscription)
      const planLimits = getPlanLimits(currentPlan)

      // Real usage data from usage tracking
      const totalGenerations = await UsageService.getUserGenerationCount(
        ctx.user.id
      )
      const generationsByPlatform =
        await UsageService.getUserGenerationsByPlatform(ctx.user.id)

      const currentUsage = {
        users: 1,
        projects: 0,
        apiCalls: 0,
        generations: totalGenerations,
      }

      const usagePercentages = {
        users:
          planLimits.maxUsers === -1
            ? 0
            : (currentUsage.users / planLimits.maxUsers) * 100,
        projects:
          planLimits.maxProjects === -1
            ? 0
            : (currentUsage.projects / planLimits.maxProjects) * 100,
        apiCalls:
          planLimits.maxApiCalls === -1
            ? 0
            : (currentUsage.apiCalls / planLimits.maxApiCalls) * 100,
        generations:
          planLimits.maxGenerations === -1
            ? 0
            : (currentUsage.generations / planLimits.maxGenerations) * 100,
      }

      // Ensure we always return valid data
      const result = {
        subscription: userSubscription
          ? {
              ...userSubscription,
              currentPeriodStart:
                userSubscription.currentPeriodStart.toISOString(),
              currentPeriodEnd: userSubscription.currentPeriodEnd.toISOString(),
              canceledAt: userSubscription.canceledAt?.toISOString() || null,
              endsAt: userSubscription.endsAt?.toISOString() || null,
              endedAt: userSubscription.endedAt?.toISOString() || null,
              createdAt: userSubscription.createdAt.toISOString(),
              updatedAt: userSubscription.updatedAt.toISOString(),
            }
          : null,
        currentPlan: currentPlan,
        planLimits: planLimits,
        currentPricingPlan: currentPlan
          ? PRICING_PLANS.find((p) => p.title.toLowerCase() === currentPlan)
          : null,
        currentUsage,
        usagePercentages,
        generationsByPlatform,
      }

      console.log('📊 Billing data retrieved:', {
        hasSubscription: !!result.subscription,
        currentPlan: result.currentPlan,
        userId: ctx.user.id,
        timestamp: new Date().toISOString(),
      })
      return result
    } catch (error) {
      console.error('❌ Error fetching billing data:', error)
      console.error('🔍 User context:', {
        userId: ctx.user.id,
        email: ctx.user.email,
      })
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch billing information',
      })
    }
  }),

  // Get usage statistics
  getUsageStats: protectedProcedure.query(async ({ ctx }) => {
    try {
      // Real usage data from usage tracking
      const totalGenerations = await UsageService.getUserGenerationCount(
        ctx.user.id
      )
      const generationsByPlatform =
        await UsageService.getUserGenerationsByPlatform(ctx.user.id)

      return {
        users: 1,
        projects: 0,
        apiCalls: 0,
        generations: totalGenerations,
        generationsByPlatform,
        period: {
          start: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
          ).toISOString(),
          end: new Date().toISOString(),
        },
      }
    } catch (error) {
      console.error('Error fetching usage stats:', error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch usage statistics',
      })
    }
  }),

  // Open customer portal or redirect to checkout
  openCustomerPortal: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      // Get user's subscription
      const userSubscription = await db
        .select()
        .from(subscription)
        .where(eq(subscription.userId, ctx.user.id))
        .orderBy(desc(subscription.createdAt))
        .limit(1)
        .then((rows) => rows[0] || null)

      if (!userSubscription) {
        // No subscription found, redirect to checkout for upgrade
        // Since createCustomerOnSignUp is now true, we redirect to checkout
        const checkoutUrl = `/pricing?upgrade=true&plan=pro&userId=${ctx.user.id}`

        return {
          url: checkoutUrl,
          success: true,
          isCheckout: true,
        }
      }

      // User has subscription, create customer portal session with Polar
      // In a real implementation, you would create a customer portal session with Polar
      // For now, we'll return a placeholder URL
      const portalUrl = `https://polar.sh/customer-portal?customer_id=${userSubscription.polarId}`

      return {
        url: portalUrl,
        success: true,
        isCheckout: false,
      }
    } catch (error) {
      console.error('Error opening customer portal:', error)

      if (error instanceof TRPCError) {
        throw error
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to open customer portal',
      })
    }
  }),

  // Cancel subscription
  cancelSubscription: protectedProcedure
    .input(
      z.object({
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ ctx }) => {
      try {
        // Get user's subscription
        const userSubscription = await db
          .select()
          .from(subscription)
          .where(eq(subscription.userId, ctx.user.id))
          .orderBy(desc(subscription.createdAt))
          .limit(1)
          .then((rows) => rows[0] || null)

        if (!userSubscription) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No active subscription found',
          })
        }

        if (userSubscription.status !== 'active') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Subscription is not active',
          })
        }

        // In a real implementation, you would call Polar API to cancel the subscription
        // For now, we'll just update the database
        await db
          .update(subscription)
          .set({
            cancelAtPeriodEnd: true,
            canceledAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(subscription.id, userSubscription.id))

        return {
          success: true,
          message: 'Subscription scheduled for cancellation at period end',
        }
      } catch (error) {
        console.error('Error cancelling subscription:', error)

        if (error instanceof TRPCError) {
          throw error
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to cancel subscription',
        })
      }
    }),

  // Reactivate subscription
  reactivateSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      // Get user's subscription
      const userSubscription = await db
        .select()
        .from(subscription)
        .where(eq(subscription.userId, ctx.user.id))
        .orderBy(desc(subscription.createdAt))
        .limit(1)
        .then((rows) => rows[0] || null)

      if (!userSubscription) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No subscription found',
        })
      }

      if (!userSubscription.cancelAtPeriodEnd) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Subscription is not scheduled for cancellation',
        })
      }

      // In a real implementation, you would call Polar API to reactivate the subscription
      // For now, we'll just update the database
      await db
        .update(subscription)
        .set({
          cancelAtPeriodEnd: false,
          canceledAt: null,
          updatedAt: new Date(),
        })
        .where(eq(subscription.id, userSubscription.id))

      return {
        success: true,
        message: 'Subscription reactivated successfully',
      }
    } catch (error) {
      console.error('Error reactivating subscription:', error)

      if (error instanceof TRPCError) {
        throw error
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to reactivate subscription',
      })
    }
  }),
})
