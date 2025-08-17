import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { UsageService } from '@/lib/usage'
import { getUserPlan } from '@/lib/plans'
import { db } from '@/db'
import { eq, desc } from 'drizzle-orm'
import { subscription } from '@/db/schema'

const API_KEY = process.env.YOUTUBE_API_KEY

function extractVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url)
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1).split('?')[0]
    }
    return urlObj.searchParams.get('v')
  } catch (error) {
    console.error('Error parsing URL:', error)
    return null
  }
}
export async function GET(request: NextRequest, response: NextResponse) {
  return NextResponse.json({ message: 'running' }, { status: 200 })
}
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

    const { videoUrl } = await request.json()

    if (!videoUrl) {
      return NextResponse.json(
        { error: 'Video URL is required' },
        { status: 400 }
      )
    }

    const videoId = extractVideoId(videoUrl)

    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      )
    }

    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails,player&id=${videoId}&key=${API_KEY}`

    const response = await fetch(apiUrl)
    const data = await response.json()

    if (data.items && data.items.length > 0) {
      const video = data.items[0]
      const result = {
        thumbnails: Object.fromEntries(
          Object.entries(video.snippet.thumbnails).map(
            ([key, thumb]: [string, any]) => [key, thumb.url]
          )
        ),
      }

      // Record the generation
      await UsageService.recordGeneration(
        session.user.id,
        'youtube',
        `videoId:${videoId}`
      )

      // Include usage info in response
      const newRemaining = remaining - 1
      return NextResponse.json({
        ...result,
        usage: {
          plan: userPlan,
          remaining: userPlan === 'free' ? newRemaining : -1,
        },
      })
    }
    return NextResponse.json({ error: 'Video not found' }, { status: 404 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
