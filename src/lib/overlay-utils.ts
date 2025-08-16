/**
 * Utility functions for overlay management and loading
 */

export interface OverlayInfo {
  id: string
  filename: string
  path: string
  displayName: string
}

/**
 * Get all available overlays from the overlays directory
 * This function dynamically discovers overlay files
 */
export function getAvailableOverlays(): OverlayInfo[] {
  // For now, we'll start with the known overlay and expand this
  // In a real implementation, this could be enhanced to read from an API
  // or use file system discovery in a Next.js API route
  const overlays: OverlayInfo[] = [
    {
      id: '023',
      filename: '023.webp',
      path: '/overlays/023.webp',
      displayName: 'Overlay 023',
    },
  ]

  return overlays
}

/**
 * Get overlay path by ID
 */
export function getOverlayPath(overlayId: string): string {
  const overlay = getAvailableOverlays().find((o) => o.id === overlayId)
  return overlay ? overlay.path : ''
}

/**
 * Validate if an overlay exists
 */
export function isValidOverlay(overlayId: string | null): boolean {
  if (!overlayId) return false
  return getAvailableOverlays().some((o) => o.id === overlayId)
}

/**
 * Get overlay display name
 */
export function getOverlayDisplayName(overlayId: string): string {
  const overlay = getAvailableOverlays().find((o) => o.id === overlayId)
  return overlay ? overlay.displayName : 'Unknown Overlay'
}

/**
 * Validate and sanitize overlay opacity value
 */
export function sanitizeOverlayOpacity(opacity: number): number {
  if (typeof opacity !== 'number' || isNaN(opacity)) return 0.5
  return Math.max(0, Math.min(1, opacity))
}

/**
 * Convert overlay ID to CSS background image style
 */
export function getOverlayBackgroundStyle(
  overlayId: string | null,
  opacity: number
): string {
  if (!overlayId || !isValidOverlay(overlayId)) return 'none'

  const path = getOverlayPath(overlayId)
  sanitizeOverlayOpacity(opacity) // Validate opacity even if not used in this function

  return `url('${path}')`
}

/**
 * Get overlay CSS styles for rendering
 */
export function getOverlayStyles(
  overlayId: string | null,
  opacity: number
): React.CSSProperties {
  if (!overlayId || !isValidOverlay(overlayId)) {
    return { display: 'none' }
  }

  const path = getOverlayPath(overlayId)
  const sanitizedOpacity = sanitizeOverlayOpacity(opacity)

  return {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url('${path}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    opacity: sanitizedOpacity,
    pointerEvents: 'none',
    zIndex: 10, // Above content, below watermark
  }
}
