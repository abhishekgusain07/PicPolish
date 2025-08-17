import { domToPng, domToJpeg, domToWebp } from 'modern-screenshot'

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

  // Store original styles and classes to restore later
  const originalStyles = new Map<Element, string>()
  const originalClasses = new Map<Element, string>()

  try {
    console.log('Capturing element:', element.id, element.className)

    if (!element || element.offsetWidth === 0 || element.offsetHeight === 0) {
      throw new ImageCaptureError('Element has no visible dimensions')
    }

    // Shadow-related Tailwind classes to temporarily remove
    const shadowClasses = [
      'shadow',
      'shadow-sm',
      'shadow-md',
      'shadow-lg',
      'shadow-xl',
      'shadow-2xl',
      'shadow-inner',
      'shadow-none',
      'drop-shadow',
      'drop-shadow-sm',
      'drop-shadow-md',
      'drop-shadow-lg',
      'drop-shadow-xl',
      'drop-shadow-2xl',
      'drop-shadow-none',
    ]

    // Process the main element and all children
    const allElements = [element, ...Array.from(element.querySelectorAll('*'))]

    allElements.forEach((el) => {
      const htmlEl = el as HTMLElement

      // Store and remove inline box-shadow styles
      const computedStyle = window.getComputedStyle(el)
      if (computedStyle.boxShadow !== 'none') {
        originalStyles.set(el, htmlEl.style.boxShadow)
        htmlEl.style.setProperty('box-shadow', 'none', 'important')
      }

      // Store and temporarily remove shadow classes
      const currentClasses = Array.from(el.classList)
      const hasShadowClasses = currentClasses.some((cls) =>
        shadowClasses.some((shadowCls) => cls.includes(shadowCls))
      )

      if (hasShadowClasses) {
        originalClasses.set(el, el.className)
        const filteredClasses = currentClasses.filter(
          (cls) => !shadowClasses.some((shadowCls) => cls.includes(shadowCls))
        )
        el.className = filteredClasses.join(' ')
      }
    })

    // Force a reflow to ensure styles are applied
    element.offsetHeight

    const captureOptions = {
      scale,
      quality: format !== 'png' ? quality : undefined,
      backgroundColor: format === 'jpeg' ? backgroundColor : undefined,
      style: {
        overflow: 'hidden',
      },
    }

    console.log('Using capture options:', captureOptions)

    let dataUrl: string

    switch (format) {
      case 'jpeg':
        dataUrl = await domToJpeg(element, captureOptions)
        break
      case 'webp':
        dataUrl = await domToWebp(element, captureOptions)
        break
      case 'png':
      default:
        dataUrl = await domToPng(element, captureOptions)
        break
    }

    // Restore original styles and classes
    originalStyles.forEach((originalValue, el) => {
      if (originalValue) {
        ;(el as HTMLElement).style.boxShadow = originalValue
      } else {
        ;(el as HTMLElement).style.removeProperty('box-shadow')
      }
    })

    originalClasses.forEach((originalClassName, el) => {
      el.className = originalClassName
    })

    console.log('Generated dataURL:', dataUrl.substring(0, 100) + '...')

    // Convert dataURL to blob
    const blob = dataUrlToBlob(dataUrl)
    console.log('Created blob:', blob.size, 'bytes')

    return blob
  } catch (error) {
    // Ensure styles and classes are restored even on error
    originalStyles.forEach((originalValue, el) => {
      if (originalValue) {
        ;(el as HTMLElement).style.boxShadow = originalValue
      } else {
        ;(el as HTMLElement).style.removeProperty('box-shadow')
      }
    })

    originalClasses.forEach((originalClassName, el) => {
      el.className = originalClassName
    })

    console.error('Modern-screenshot capture error:', error)
    if (error instanceof ImageCaptureError) {
      throw error
    }
    throw new ImageCaptureError(
      'Failed to capture element as image',
      error instanceof Error ? error : new Error(String(error))
    )
  }
}

function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',')
  const mimeMatch = arr[0].match(/:(.*?);/)
  const mime = mimeMatch ? mimeMatch[1] : 'image/png'
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new Blob([u8arr], { type: mime })
}

export function downloadBlob(blob: Blob, filename: string): void {
  console.log('Downloading blob:', blob.size, 'bytes as', filename)

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'

  document.body.appendChild(link)
  link.click()

  setTimeout(() => {
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    console.log('Download completed and cleaned up')
  }, 100)
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
