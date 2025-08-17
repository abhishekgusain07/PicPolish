import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { UsageService } from '@/lib/usage'
import { getUserPlan } from '@/lib/plans'
import { db } from '@/db'
import { eq, desc } from 'drizzle-orm'
import { subscription } from '@/db/schema'

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

    if (!canGenerate) {
      return NextResponse.json(
        {
          error: 'Generation limit exceeded',
          plan: userPlan,
          remaining: 0,
          upgradeRequired: true,
        },
        { status: 403 }
      )
    }

    const { metadata } = await request.json()

    // Record the generation
    await UsageService.recordGeneration(
      session.user.id,
      'screenshot',
      metadata || 'screenshot-capture'
    )

    // Return usage info
    const newRemaining = remaining - 1
    return NextResponse.json({
      success: true,
      usage: {
        plan: userPlan,
        remaining: userPlan === 'free' ? newRemaining : -1,
      },
    })
  } catch (error) {
    console.error('Error recording screenshot generation:', error)
    return NextResponse.json(
      { error: 'Failed to record generation' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get user session
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

    return NextResponse.json({
      canGenerate,
      usage: {
        plan: userPlan,
        remaining: userPlan === 'free' ? remaining : -1,
      },
    })
  } catch (error) {
    console.error('Error checking screenshot usage:', error)
    return NextResponse.json(
      { error: 'Failed to check usage' },
      { status: 500 }
    )
  }
}
