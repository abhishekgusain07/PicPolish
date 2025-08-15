import { NextRequest, NextResponse } from 'next/server'

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
      return NextResponse.json(result)
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
