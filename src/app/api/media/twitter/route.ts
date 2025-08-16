import { type NextRequest, NextResponse } from 'next/server'
import {
  Rettiwt,
  type TweetEntities,
  type TweetMedia,
  type User,
  type Tweet,
} from 'rettiwt-api'

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
    return NextResponse.json(sanitizedTweet)
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
