'use client'
import { useRef, useEffect, useCallback } from 'react'
import { PolaroidState, PolaroidConfig, PolaroidStyle } from '@/types/thumbnail'

interface PolaroidCanvasProps {
  state: PolaroidState
  config: PolaroidConfig
  width?: number
  height?: number
  scale?: number
}

export function PolaroidCanvas({
  state,
  config,
  width = 400,
  height = 400,
  scale = 1,
}: PolaroidCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const drawDecorativeElement = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      element: string,
      x: number,
      y: number,
      size: number = 20
    ) => {
      ctx.save()
      ctx.font = `${size}px Arial`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      switch (element) {
        case 'heart':
          ctx.fillText('♡', x, y)
          break
        case 'star':
          ctx.fillText('✦', x, y)
          break
        case 'flower':
          ctx.fillText('❀', x, y)
          break
      }

      ctx.restore()
    },
    []
  )

  const drawClassicFrame = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      image: HTMLImageElement,
      canvasWidth: number,
      canvasHeight: number
    ) => {
      const frameWidth = config.styles.classic.frameWidth * scale
      const imageSize = Math.min(canvasWidth, canvasHeight) - frameWidth * 2
      const imageX = (canvasWidth - imageSize) / 2
      const imageY = (canvasHeight - imageSize) / 2

      // Draw frame background
      ctx.fillStyle = state.customizations.frameColor
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)

      // Draw image
      ctx.drawImage(image, imageX, imageY, imageSize, imageSize)

      // Draw decorative element if specified
      if (state.customizations.decorativeElement !== 'none') {
        ctx.fillStyle = '#666'
        drawDecorativeElement(
          ctx,
          state.customizations.decorativeElement,
          canvasWidth - frameWidth / 2,
          frameWidth / 2,
          16 * scale
        )
      }
    },
    [config, state, scale, drawDecorativeElement]
  )

  const drawVintageFrame = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      image: HTMLImageElement,
      canvasWidth: number,
      canvasHeight: number
    ) => {
      const frameWidth = config.styles.vintage.frameWidth * scale
      const textAreaHeight = 80 * scale
      const imageSize = Math.min(
        canvasWidth - frameWidth * 2,
        canvasHeight - frameWidth - textAreaHeight
      )
      const imageX = (canvasWidth - imageSize) / 2
      const imageY = frameWidth

      // Draw aged frame background
      ctx.fillStyle = state.customizations.frameColor

      // Add aging effect with gradient
      if (state.customizations.agingEffect > 0) {
        const gradient = ctx.createRadialGradient(
          canvasWidth / 2,
          canvasHeight / 2,
          0,
          canvasWidth / 2,
          canvasHeight / 2,
          Math.max(canvasWidth, canvasHeight) / 2
        )
        const ageIntensity = state.customizations.agingEffect / 100
        gradient.addColorStop(0, state.customizations.frameColor)
        gradient.addColorStop(1, `rgba(139, 117, 93, ${ageIntensity})`)
        ctx.fillStyle = gradient
      }

      ctx.fillRect(0, 0, canvasWidth, canvasHeight)

      // Draw image
      ctx.drawImage(image, imageX, imageY, imageSize, imageSize)

      // Draw text area
      const textY = imageY + imageSize + 20 * scale
      if (state.textOverlay.text) {
        ctx.fillStyle = state.textOverlay.color
        ctx.font = `italic ${state.textOverlay.size * scale}px cursive`
        ctx.textAlign = 'center'

        // Wrap text if too long
        const maxWidth = canvasWidth - frameWidth * 2
        const words = state.textOverlay.text.split(' ')
        let line = ''
        let y = textY

        for (let word of words) {
          const testLine = line + word + ' '
          const metrics = ctx.measureText(testLine)
          if (metrics.width > maxWidth && line !== '') {
            ctx.fillText(line, canvasWidth / 2, y)
            line = word + ' '
            y += state.textOverlay.size * scale * 1.2
          } else {
            line = testLine
          }
        }
        ctx.fillText(line, canvasWidth / 2, y)

        // Draw date
        if (state.textOverlay.date) {
          ctx.font = `${(state.textOverlay.size - 2) * scale}px cursive`
          ctx.textAlign = 'right'
          ctx.fillText(
            state.textOverlay.date,
            canvasWidth - frameWidth,
            canvasHeight - frameWidth / 2
          )
        }
      }
    },
    [config, state, scale]
  )

  const drawFilmstripFrame = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      images: HTMLImageElement[],
      canvasWidth: number,
      canvasHeight: number
    ) => {
      const frameWidth = config.styles.filmstrip.frameWidth * scale
      const imageCount = Math.min(images.length, 3) // Max 3 images in filmstrip
      const imageHeight =
        (canvasHeight - frameWidth * (imageCount + 1)) / imageCount
      const imageWidth = canvasWidth - frameWidth * 2

      // Draw film background (dark)
      ctx.fillStyle = '#1a1a1a'
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)

      // Draw film perforations
      ctx.fillStyle = '#000'
      const perfSize = 8 * scale
      const perfSpacing = 12 * scale

      for (
        let y = perfSpacing;
        y < canvasHeight - perfSpacing;
        y += perfSpacing
      ) {
        // Left perforations
        ctx.fillRect(perfSize / 2, y, perfSize, perfSize / 2)
        // Right perforations
        ctx.fillRect(canvasWidth - perfSize * 1.5, y, perfSize, perfSize / 2)
      }

      // Draw images
      images.slice(0, imageCount).forEach((image, index) => {
        const y = frameWidth + index * (imageHeight + frameWidth)

        // Draw white frame around each image
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(frameWidth - 2, y - 2, imageWidth + 4, imageHeight + 4)

        // Draw image
        ctx.drawImage(image, frameWidth, y, imageWidth, imageHeight)
      })
    },
    [config, scale]
  )

  const renderPolaroid = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = width * scale
    canvas.height = height * scale
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (state.images.length === 0) {
      // Draw placeholder
      ctx.fillStyle = '#f1f5f9'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#64748b'
      ctx.font = `${16 * scale}px Arial`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('No image selected', canvas.width / 2, canvas.height / 2)
      return
    }

    try {
      // Load images
      const imagePromises = state.images.map((img) => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const image = new Image()
          image.crossOrigin = 'anonymous'
          image.onload = () => resolve(image)
          image.onerror = reject
          image.src = img.url
        })
      })

      const loadedImages = await Promise.all(imagePromises)

      // Render based on style
      switch (state.style) {
        case 'classic':
          if (loadedImages[0]) {
            drawClassicFrame(ctx, loadedImages[0], canvas.width, canvas.height)
          }
          break

        case 'vintage':
          if (loadedImages[0]) {
            drawVintageFrame(ctx, loadedImages[0], canvas.width, canvas.height)
          }
          break

        case 'filmstrip':
          drawFilmstripFrame(ctx, loadedImages, canvas.width, canvas.height)
          break
      }
    } catch (error) {
      console.error('Error rendering polaroid:', error)

      // Draw error state
      ctx.fillStyle = '#fef2f2'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#dc2626'
      ctx.font = `${14 * scale}px Arial`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('Error loading image', canvas.width / 2, canvas.height / 2)
    }
  }, [
    state,
    config,
    width,
    height,
    scale,
    drawClassicFrame,
    drawVintageFrame,
    drawFilmstripFrame,
  ])

  // Re-render when state changes
  useEffect(() => {
    renderPolaroid()
  }, [renderPolaroid])

  return (
    <canvas
      ref={canvasRef}
      className="rounded-lg shadow-lg max-w-full max-h-full"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
