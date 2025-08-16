/**
 * Overlay constants and configuration
 */

import { getAvailableOverlays } from '@/lib/overlay-utils'

// Available overlays - dynamically loaded
export const OVERLAYS = getAvailableOverlays()

// Default overlay settings
export const DEFAULT_OVERLAY_OPACITY = 0.5
export const MIN_OVERLAY_OPACITY = 0
export const MAX_OVERLAY_OPACITY = 1
export const OVERLAY_OPACITY_STEP = 0.1

// Overlay none option
export const OVERLAY_NONE = null

// Overlay file naming pattern (for future expansion)
export const OVERLAY_FILE_PATTERN = /^\d{3}\.webp$/
export const OVERLAY_DIRECTORY = '/overlays/'

// Common overlay blend modes (for future enhancement)
export const OVERLAY_BLEND_MODES = [
  'normal',
  'multiply',
  'screen',
  'overlay',
  'soft-light',
  'hard-light',
] as const

export type OverlayBlendMode = (typeof OVERLAY_BLEND_MODES)[number]
