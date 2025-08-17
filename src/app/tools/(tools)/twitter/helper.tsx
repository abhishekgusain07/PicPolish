export default function extractTweetId(input: string): string {
  // Step 1: Check if the input is a valid URL
  let url: URL
  try {
    url = new URL(input)
  } catch {
    throw new Error('Invalid URL provided')
  }

  // Step 2: Check if the URL is from x.com or twitter.com
  if (!(url.hostname === 'x.com' || url.hostname === 'twitter.com')) {
    throw new Error('URL is not from x.com or twitter.com')
  }

  // Step 3: Extract the tweet ID from the URL path
  const pathParts = url.pathname.split('/')
  const statusIndex = pathParts.indexOf('status')

  if (statusIndex === -1 || statusIndex === pathParts.length - 1) {
    throw new Error('Unable to find tweet ID in the URL')
  }

  const tweetId = pathParts[statusIndex + 1]

  // Step 4: Validate the tweet ID
  if (!/^\d+$/.test(tweetId)) {
    throw new Error('Invalid tweet ID format')
  }

  return tweetId
}
export function convertDateFormat(inputDate: string): string {
  // Parse the input date string
  const date = new Date(inputDate)

  // Format the time
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }
  const timeString = date.toLocaleTimeString('en-US', timeOptions)

  // Format the date
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }
  const dateString = date.toLocaleDateString('en-US', dateOptions)

  // Combine the formatted strings
  return `${timeString} · ${dateString}`
}

export function convertViews(views: number): string {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M Views`
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K Views`
  }
  return `${views} Views`
}

export function convertNumber(number: number): string {
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`
  }
  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`
  }
  return `${number}`
}
