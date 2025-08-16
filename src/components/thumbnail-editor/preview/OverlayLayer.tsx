import { OverlayLayerProps } from '@/types/thumbnail'
import { getOverlayStyles } from '@/lib/overlay-utils'

export function OverlayLayer({
  selectedOverlay,
  overlayOpacity,
}: OverlayLayerProps) {
  // Don't render anything if no overlay is selected
  if (!selectedOverlay) {
    return null
  }

  const overlayStyles = getOverlayStyles(selectedOverlay, overlayOpacity)

  return (
    <div
      className="overlay-layer"
      style={overlayStyles}
      data-overlay-id={selectedOverlay}
      data-overlay-opacity={overlayOpacity}
    />
  )
}
