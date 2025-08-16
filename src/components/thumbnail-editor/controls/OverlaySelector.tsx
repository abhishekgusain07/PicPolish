import { useState } from 'react'
import { cn } from '@/lib/utils'
import { OverlaySelectorProps } from '@/types/thumbnail'
import { OVERLAYS, OVERLAY_NONE } from '@/constants/overlays'
import { getOverlayPath } from '@/lib/overlay-utils'

export function OverlaySelector({
  selectedOverlay,
  overlayOpacity,
  onOverlayChange,
  onOpacityChange,
}: OverlaySelectorProps) {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})

  const handleOverlaySelect = (overlayId: string | null) => {
    onOverlayChange(overlayId)
  }

  const handleImageLoad = (overlayId: string) => {
    setIsLoading((prev) => ({ ...prev, [overlayId]: false }))
  }

  const handleImageError = (overlayId: string) => {
    setIsLoading((prev) => ({ ...prev, [overlayId]: false }))
    console.warn(`Failed to load overlay: ${overlayId}`)
  }

  const handleOpacitySliderChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onOpacityChange(parseFloat(e.target.value))
  }

  return (
    <div className="space-y-4">
      {/* Overlay Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3 max-h-[20vh] md:max-h-[40vh] overflow-y-auto p-3 sm:p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/50 dark:border-slate-600/50">
        {/* None Option */}
        <button
          className={cn(
            'aspect-square rounded-xl border-2 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center text-xs font-medium',
            selectedOverlay === OVERLAY_NONE
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-200/50 dark:shadow-blue-900/50 scale-105'
              : 'border-slate-300/50 dark:border-slate-500/50 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-400'
          )}
          onClick={() => handleOverlaySelect(OVERLAY_NONE)}
        >
          None
        </button>

        {/* Overlay Options */}
        {OVERLAYS.map((overlay) => {
          const isSelected = selectedOverlay === overlay.id
          const isImageLoading = isLoading[overlay.id]

          return (
            <button
              key={overlay.id}
              className={cn(
                'aspect-square rounded-xl border-2 transition-all duration-200 hover:scale-105 active:scale-95 overflow-hidden relative',
                isSelected
                  ? 'border-blue-500 shadow-lg shadow-blue-200/50 dark:shadow-blue-900/50 scale-105'
                  : 'border-slate-300/50 dark:border-slate-500/50 hover:border-slate-400 dark:hover:border-slate-400'
              )}
              onClick={() => handleOverlaySelect(overlay.id)}
            >
              {/* Loading State */}
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-700">
                  <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
                </div>
              )}

              {/* Overlay Preview */}
              <div
                className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 relative"
                style={{
                  backgroundImage: `url('${getOverlayPath(overlay.id)}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                {/* Overlay ID Label */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5">
                  {overlay.id}
                </div>

                {/* Hidden image for loading detection */}
                <img
                  src={getOverlayPath(overlay.id)}
                  alt={overlay.displayName}
                  className="hidden"
                  onLoad={() => handleImageLoad(overlay.id)}
                  onError={() => handleImageError(overlay.id)}
                />
              </div>
            </button>
          )
        })}
      </div>

      {/* Opacity Control */}
      <div className="flex items-center justify-between px-4">
        <span className="text-xs text-slate-600 dark:text-slate-400">
          Opacity
        </span>
        <div className="flex items-center gap-2 min-w-[120px]">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={overlayOpacity}
            onChange={handleOpacitySliderChange}
            className="flex-1 h-2 rounded-full appearance-none bg-slate-200 dark:bg-slate-600 outline-none slider-thumb"
          />
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 w-8 text-right">
            {overlayOpacity.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Helper Text */}
      {selectedOverlay && (
        <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
          Selected:{' '}
          {OVERLAYS.find((o) => o.id === selectedOverlay)?.displayName ||
            selectedOverlay}
        </div>
      )}
    </div>
  )
}
