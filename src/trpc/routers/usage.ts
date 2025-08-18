import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { eq, desc } from 'drizzle-orm'
import { db } from '@/db'
import { subscription } from '@/db/schema'
import { getUserPlan } from '@/lib/plans'
import { UsageService, Platform } from '@/lib/usage'
import { createTRPCRouter, protectedProcedure } from '../init'

export const usageRouter = createTRPCRouter({
  // Get current user's usage statistics
  getUsageStats: protectedProcedure.query(async ({ ctx }) => {
    try {
      // Get user's subscription and plan
      const userSubscription = await db
        .select()
        .from(subscription)
        .where(eq(subscription.userId, ctx.user.id))
        .orderBy(desc(subscription.createdAt))
        .limit(1)
        .then((rows) => rows[0] || null)

      const userPlan = getUserPlan(userSubscription)

      // Get total generation count
      const totalGenerations = await UsageService.getUserGenerationCount(
        ctx.user.id
      )

      // Get generations by platform
      const generationsByPlatform =
        await UsageService.getUserGenerationsByPlatform(ctx.user.id)

      // Check if user can generate
      const { canGenerate, remaining } = await UsageService.canUserGenerate(
        ctx.user.id,
        userPlan
      )

      return {
        plan: userPlan,
        totalGenerations,
        generationsByPlatform,
        canGenerate,
        remaining: userPlan === 'free' ? remaining : -1, // -1 indicates unlimited
        limit: userPlan === 'free' ? 5 : -1,
      }
    } catch (error) {
      console.error('❌ Error fetching usage stats:', error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch usage statistics',
      })
    }
  }),

  // Check if user can generate for a specific platform
  canGenerate: protectedProcedure
    .input(
      z.object({
        platform: z.enum(['screenshot', 'twitter', 'youtube', 'polaroid']),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        // Get user's subscription and plan
        const userSubscription = await db
          .select()
          .from(subscription)
          .where(eq(subscription.userId, ctx.user.id))
          .orderBy(desc(subscription.createdAt))
          .limit(1)
          .then((rows) => rows[0] || null)

        const userPlan = getUserPlan(userSubscription)

        // Check if user can generate
        const { canGenerate, remaining } = await UsageService.canUserGenerate(
          ctx.user.id,
          userPlan
        )

        return {
          canGenerate,
          remaining: userPlan === 'free' ? remaining : -1,
          plan: userPlan,
          platform: input.platform,
        }
      } catch (error) {
        console.error('❌ Error checking generation capability:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to check generation capability',
        })
      }
    }),

  // Record a generation (used by client-side tools like screenshot)
  recordGeneration: protectedProcedure
    .input(
      z.object({
        platform: z.enum(['screenshot', 'twitter', 'youtube', 'polaroid']),
        metadata: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Get user's subscription and plan
        const userSubscription = await db
          .select()
          .from(subscription)
          .where(eq(subscription.userId, ctx.user.id))
          .orderBy(desc(subscription.createdAt))
          .limit(1)
          .then((rows) => rows[0] || null)

        const userPlan = getUserPlan(userSubscription)

        // Check if user can generate
        const { canGenerate } = await UsageService.canUserGenerate(
          ctx.user.id,
          userPlan
        )

        if (!canGenerate) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message:
              'Generation limit exceeded. Upgrade your plan to continue.',
          })
        }

        // Record the generation
        const generation = await UsageService.recordGeneration(
          ctx.user.id,
          input.platform,
          input.metadata
        )

        // Get updated usage stats
        const { remaining } = await UsageService.canUserGenerate(
          ctx.user.id,
          userPlan
        )

        return {
          success: true,
          generation,
          usage: {
            plan: userPlan,
            remaining: userPlan === 'free' ? remaining : -1,
          },
        }
      } catch (error) {
        console.error('❌ Error recording generation:', error)

        if (error instanceof TRPCError) {
          throw error
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to record generation',
        })
      }
    }),

  // Get usage history with pagination
  getUsageHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).optional().default(20),
        platform: z.enum(['screenshot', 'twitter', 'youtube']).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        // This would require adding a more complex query to UsageService
        // For now, return basic stats
        const generationsByPlatform =
          await UsageService.getUserGenerationsByPlatform(ctx.user.id)

        return {
          totalGenerations: Object.values(generationsByPlatform).reduce(
            (a, b) => a + b,
            0
          ),
          generationsByPlatform,
        }
      } catch (error) {
        console.error('❌ Error fetching usage history:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch usage history',
        })
      }
    }),
})
