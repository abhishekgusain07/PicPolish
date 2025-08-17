import { type NextRequest, NextResponse } from 'next/server'
import {
  Rettiwt,
  type TweetEntities,
  type TweetMedia,
  type User,
  type Tweet,
} from 'rettiwt-api'
import { auth } from '@/lib/auth'
import { UsageService } from '@/lib/usage'
import { getUserPlan } from '@/lib/plans'
import { db } from '@/db'
import { eq, desc } from 'drizzle-orm'
import { subscription } from '@/db/schema'

// Polyfill for buffer.transfer if not available
if (typeof Buffer !== 'undefined' && !Buffer.prototype.transfer) {
  Buffer.prototype.transfer = function () {
    return this.buffer.slice(this.byteOffset, this.byteOffset + this.byteLength)
  }
}

function sanitizeTweetData(tweet: Tweet): Record<string, any> {
  return {
    bookmarkCount: tweet.bookmarkCount,
    createdAt: tweet.createdAt,
    entities: sanitizeTweetEntities(tweet.entities),
    fullText: tweet.fullText,
    id: tweet.id,
    lang: tweet.lang,
    likeCount: tweet.likeCount,
    media: tweet.media ? tweet.media.map(sanitizeTweetMedia) : undefined,
    quoteCount: tweet.quoteCount,
    quoted: tweet.quoted,
    replyCount: tweet.replyCount,
    replyTo: tweet.replyTo,
    retweetCount: tweet.retweetCount,
    retweetedTweet: tweet.retweetedTweet
      ? sanitizeTweetData(tweet.retweetedTweet)
      : undefined,
    tweetBy: sanitizeUser(tweet.tweetBy),
    viewCount: tweet.viewCount,
  }
}

function sanitizeTweetEntities(entities: TweetEntities): Record<string, any> {
  return {
    hashtags: entities.hashtags,
    mentionedUsers: entities.mentionedUsers,
    urls: entities.urls,
  }
}

function sanitizeTweetMedia(media: TweetMedia): Record<string, any> {
  return {
    type: media.type,
    url: media.url,
  }
}

function sanitizeUser(user: User): Record<string, any> {
  return {
    createdAt: user.createdAt,
    description: user.description,
    followersCount: user.followersCount,
    followingsCount: user.followingsCount,
    fullName: user.fullName,
    id: user.id,
    isVerified: user.isVerified,
    likeCount: user.likeCount,
    location: user.location,
    pinnedTweet: user.pinnedTweet,
    profileBanner: user.profileBanner,
    profileImage: user.profileImage,
    statusesCount: user.statusesCount,
    userName: user.userName,
  }
}
const rettiwt = new Rettiwt({ apiKey: process.env.RETTIWT_API_KEY })

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

    const body = await request.json()
    const { tweetId } = body

    if (!tweetId) {
      return NextResponse.json(
        { error: 'Tweet ID is required' },
        { status: 400 }
      )
    }

    const tweet = await getTweetDetails(tweetId)
    const sanitizedTweet = sanitizeTweetData(tweet)

    // Record the generation
    await UsageService.recordGeneration(
      session.user.id,
      'twitter',
      `tweetId:${tweetId}`
    )

    // Include usage info in response
    const newRemaining = remaining - 1
    return NextResponse.json({
      ...sanitizedTweet,
      usage: {
        plan: userPlan,
        remaining: userPlan === 'free' ? newRemaining : -1,
      },
    })
  } catch (error) {
    console.error('Error processing tweet:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tweet details' },
      { status: 500 }
    )
  }
}

async function getTweetDetails(tweetId: string): Promise<Tweet> {
  const tweet = await rettiwt.tweet.details(tweetId)
  if (!tweet) {
    throw new Error('Tweet not found')
  }
  return tweet
}
