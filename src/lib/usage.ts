import { db } from '@/db'
import { generation } from '@/db/schema'
import { eq, count } from 'drizzle-orm'
import { nanoid } from 'nanoid'

export type Platform = 'screenshot' | 'twitter' | 'youtube'

export interface GenerationRecord {
  id: string
  userId: string
  platform: Platform
  createdAt: Date
  metadata?: string
}

export class UsageService {
  static async recordGeneration(
    userId: string,
    platform: Platform,
    metadata?: string
  ): Promise<GenerationRecord> {
    const record = await db
      .insert(generation)
      .values({
        id: nanoid(),
        userId,
        platform,
        metadata,
      })
      .returning()
      .then((rows) => rows[0])

    return record
  }

  static async getUserGenerationCount(userId: string): Promise<number> {
    const result = await db
      .select({ count: count() })
      .from(generation)
      .where(eq(generation.userId, userId))
      .then((rows) => rows[0]?.count || 0)

    return result
  }

  static async getUserGenerationsByPlatform(
    userId: string
  ): Promise<Record<Platform, number>> {
    const results = await db
      .select({
        platform: generation.platform,
        count: count(),
      })
      .from(generation)
      .where(eq(generation.userId, userId))
      .groupBy(generation.platform)

    const platformCounts: Record<Platform, number> = {
      screenshot: 0,
      twitter: 0,
      youtube: 0,
    }

    results.forEach((result) => {
      platformCounts[result.platform as Platform] = result.count
    })

    return platformCounts
  }

  static async canUserGenerate(
    userId: string,
    userPlan: 'free' | 'starter' | 'pro' | 'enterprise'
  ): Promise<{ canGenerate: boolean; remaining: number }> {
    // Paid plans have unlimited generations
    if (userPlan !== 'free') {
      return { canGenerate: true, remaining: -1 } // -1 indicates unlimited
    }

    const currentCount = await this.getUserGenerationCount(userId)
    const freeLimit = 5
    const remaining = Math.max(0, freeLimit - currentCount)
    const canGenerate = currentCount < freeLimit

    return { canGenerate, remaining }
  }
}
