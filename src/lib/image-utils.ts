export type ImageFormat = 'jpeg' | 'webp' | 'png'

export interface CaptureOptions {
  format?: ImageFormat
  quality?: number
  backgroundColor?: string
  scale?: number
}

export class ImageCaptureError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error
  ) {
    super(message)
    this.name = 'ImageCaptureError'
  }
}

export async function captureElementAsImage(
  element: HTMLElement,
  options: CaptureOptions = {}
): Promise<Blob> {
  const {
    format = 'png',
    quality = 0.92,
    backgroundColor = '#ffffff',
    scale = 2,
  } = options

  try {
    const rect = element.getBoundingClientRect()

    if (rect.width === 0 || rect.height === 0) {
      throw new ImageCaptureError('Element has no visible dimensions')
    }

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new ImageCaptureError('Failed to get canvas 2D context')
    }

    canvas.width = rect.width * scale
    canvas.height = rect.height * scale

    ctx.scale(scale, scale)

    if (format === 'jpeg') {
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, rect.width, rect.height)
    }

    await drawElementToCanvas(ctx, element, rect)

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new ImageCaptureError('Failed to create blob from canvas'))
          }
        },
        `image/${format}`,
        format !== 'png' ? quality : undefined
      )
    })
  } catch (error) {
    if (error instanceof ImageCaptureError) {
      throw error
    }
    throw new ImageCaptureError(
      'Failed to capture element as image',
      error instanceof Error ? error : new Error(String(error))
    )
  }
}

async function drawElementToCanvas(
  ctx: CanvasRenderingContext2D,
  element: HTMLElement,
  rect: DOMRect
): Promise<void> {
  const computedStyle = window.getComputedStyle(element)

  ctx.fillStyle = computedStyle.backgroundColor || 'transparent'
  ctx.fillRect(0, 0, rect.width, rect.height)

  const borderRadius = computedStyle.borderRadius
  if (borderRadius && borderRadius !== '0px') {
    const radius = parseFloat(borderRadius)
    drawRoundedRect(ctx, 0, 0, rect.width, rect.height, radius)
    ctx.clip()
  }

  await drawElementContent(ctx, element, rect)
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

async function drawElementContent(
  ctx: CanvasRenderingContext2D,
  element: HTMLElement,
  rect: DOMRect
): Promise<void> {
  const images = element.querySelectorAll('img')
  const imagePromises: Promise<void>[] = []

  images.forEach((img) => {
    if (img.complete && img.src) {
      const imgRect = img.getBoundingClientRect()
      const relativeX = imgRect.left - rect.left
      const relativeY = imgRect.top - rect.top

      try {
        ctx.drawImage(img, relativeX, relativeY, imgRect.width, imgRect.height)
      } catch (error) {
        console.warn('Failed to draw image:', error)
      }
    }
  })

  const textNodes = getTextNodes(element)
  textNodes.forEach((textNode) => {
    const parentElement = textNode.parentElement
    if (!parentElement) return

    const range = document.createRange()
    range.selectNode(textNode)
    const textRect = range.getBoundingClientRect()

    const relativeX = textRect.left - rect.left
    const relativeY = textRect.top - rect.top

    const computedStyle = window.getComputedStyle(parentElement)
    ctx.font = `${computedStyle.fontWeight} ${computedStyle.fontSize} ${computedStyle.fontFamily}`
    ctx.fillStyle = computedStyle.color
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'

    const text = textNode.textContent || ''
    ctx.fillText(text, relativeX, relativeY)
  })

  await Promise.all(imagePromises)
}

function getTextNodes(element: HTMLElement): Text[] {
  const textNodes: Text[] = []
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      const text = node.textContent?.trim()
      return text ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
    },
  })

  let currentNode: Node | null
  while ((currentNode = walker.nextNode())) {
    textNodes.push(currentNode as Text)
  }

  return textNodes
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function convertImageFormat(
  imageBlob: Blob,
  targetFormat: ImageFormat,
  quality: number = 0.92
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      reject(new ImageCaptureError('Failed to get canvas 2D context'))
      return
    }

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height

      if (targetFormat === 'jpeg') {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      ctx.drawImage(img, 0, 0)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new ImageCaptureError('Failed to convert image format'))
          }
        },
        `image/${targetFormat}`,
        targetFormat !== 'png' ? quality : undefined
      )
    }

    img.onerror = () => {
      reject(new ImageCaptureError('Failed to load image for conversion'))
    }

    img.src = URL.createObjectURL(imageBlob)
  })
}

export function getFormatExtension(format: ImageFormat): string {
  switch (format) {
    case 'jpeg':
      return '.jpg'
    case 'webp':
      return '.webp'
    case 'png':
      return '.png'
    default:
      return '.png'
  }
}

export function generateFileName(
  baseName: string,
  format: ImageFormat
): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0]
  const extension = getFormatExtension(format)
  return `${baseName}_${timestamp}${extension}`
}
