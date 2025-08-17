import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { UsageService, Platform } from '@/lib/usage'
import { getUserPlan } from '@/lib/plans'
import { db } from '@/db'
import { eq, desc } from 'drizzle-orm'
import { subscription } from '@/db/schema'

export interface UsageCheckResult {
  canGenerate: boolean
  plan: string
  remaining: number
  userId: string
}

export class UsageMiddleware {
  /**
   * Check if user can generate and return usage information
   */
  static async checkUsage(
    request: NextRequest
  ): Promise<UsageCheckResult | null> {
    try {
      // Get user session
      const session = await auth.api.getSession({
        headers: request.headers,
      })

      if (!session?.user) {
        return null // No session, will be handled by auth middleware
      }

      // Get user's subscription and plan
      const userSubscription = await db
        .select()
        .from(subscription)
        .where(eq(subscription.userId, session.user.id))
        .orderBy(desc(subscription.createdAt))
        .limit(1)
        .then((rows) => rows[0] || null)

      const userPlan = getUserPlan(userSubscription)

      // Check if user can generate
      const { canGenerate, remaining } = await UsageService.canUserGenerate(
        session.user.id,
        userPlan
      )

      return {
        canGenerate,
        plan: userPlan,
        remaining: userPlan === 'free' ? remaining : -1,
        userId: session.user.id,
      }
    } catch (error) {
      console.error('❌ Usage middleware error:', error)
      return null
    }
  }

  /**
   * Create standardized limit exceeded response
   */
  static createLimitExceededResponse(plan: string): NextResponse {
    return NextResponse.json(
      {
        error: 'Generation limit exceeded',
        plan,
        remaining: 0,
        upgradeRequired: true,
        message: `You've reached your ${plan} plan generation limit. Upgrade to continue generating.`,
      },
      { status: 403 }
    )
  }

  /**
   * Record a generation and return updated usage
   */
  static async recordGeneration(
    userId: string,
    platform: Platform,
    metadata?: string
  ): Promise<{ plan: string; remaining: number }> {
    try {
      // Record the generation
      await UsageService.recordGeneration(userId, platform, metadata)

      // Get updated subscription info
      const userSubscription = await db
        .select()
        .from(subscription)
        .where(eq(subscription.userId, userId))
        .orderBy(desc(subscription.createdAt))
        .limit(1)
        .then((rows) => rows[0] || null)

      const userPlan = getUserPlan(userSubscription)

      // Get updated remaining count
      const { remaining } = await UsageService.canUserGenerate(userId, userPlan)

      return {
        plan: userPlan,
        remaining: userPlan === 'free' ? remaining : -1,
      }
    } catch (error) {
      console.error('❌ Error recording generation:', error)
      throw error
    }
  }

  /**
   * Create successful response with usage info
   */
  static createSuccessResponse(
    data: any,
    usage: { plan: string; remaining: number }
  ): NextResponse {
    return NextResponse.json({
      ...data,
      usage,
    })
  }

  /**
   * Wrapper for API routes to handle usage checking and recording
   */
  static async withUsageTracking<T>(
    request: NextRequest,
    platform: Platform,
    handler: (usageInfo: UsageCheckResult) => Promise<T>,
    metadata?: string
  ): Promise<NextResponse> {
    try {
      // Check usage
      const usageInfo = await this.checkUsage(request)

      if (!usageInfo) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      if (!usageInfo.canGenerate) {
        return this.createLimitExceededResponse(usageInfo.plan)
      }

      // Execute the handler
      const result = await handler(usageInfo)

      // Record the generation
      const updatedUsage = await this.recordGeneration(
        usageInfo.userId,
        platform,
        metadata
      )

      // Return success response with usage info
      return this.createSuccessResponse(result, updatedUsage)
    } catch (error) {
      console.error(`❌ Error in ${platform} generation:`, error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}
