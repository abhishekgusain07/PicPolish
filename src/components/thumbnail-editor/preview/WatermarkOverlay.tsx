import { useState } from 'react'
import { cn } from '@/lib/utils'
import { WatermarkState, PlatformConfig } from '@/types/thumbnail'

interface WatermarkOverlayProps {
  watermarkState: WatermarkState
  config: PlatformConfig
}

export function WatermarkOverlay({
  watermarkState,
  config,
}: WatermarkOverlayProps) {
  const [localWatermarkState, setLocalWatermarkState] = useState({
    showWatermark: watermarkState.showWatermark,
    watermarkStyle: watermarkState.watermarkStyle,
    watermarkText: watermarkState.watermarkText,
    showWaterMarkOptions: watermarkState.showWaterMarkOptions,
  })

  const toggleWatermark = () => {
    setLocalWatermarkState((prev) => ({
      ...prev,
      showWaterMarkOptions: !prev.showWaterMarkOptions,
    }))
  }

  const updateWatermarkShow = (show: boolean) => {
    setLocalWatermarkState((prev) => ({
      ...prev,
      showWatermark: show,
    }))
  }

  const updateWatermarkStyle = (style: 'dark' | 'light' | 'glassy') => {
    setLocalWatermarkState((prev) => ({
      ...prev,
      watermarkStyle: style,
    }))
  }

  const updateWatermarkText = (text: string) => {
    setLocalWatermarkState((prev) => ({
      ...prev,
      watermarkText: text,
    }))
  }

  const getWatermarkStyles = () => {
    switch (localWatermarkState.watermarkStyle) {
      case 'light':
        return 'bg-white/80 text-black'
      case 'glassy':
        return 'bg-black/20 backdrop-blur-sm text-white'
      default:
        return 'bg-black/30 text-white'
    }
  }

  if (!localWatermarkState.showWatermark) {
    return null
  }

  return (
    <>
      {/* Watermark */}
      <div
        className={cn(
          'absolute bottom-2 right-2 px-2 py-1 text-sm font-medium rounded cursor-pointer transition-all duration-200 hover:scale-105',
          getWatermarkStyles()
        )}
        onClick={toggleWatermark}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            toggleWatermark()
          }
        }}
        role="button"
        tabIndex={0}
      >
        {localWatermarkState.watermarkText || config.watermarkText}
      </div>

      {/* Watermark settings */}
      <div
        className={cn(
          'absolute bottom-10 right-2 bg-black text-white text-xs p-2 rounded-lg border-2 border-gray-500 z-10',
          localWatermarkState.showWaterMarkOptions ? 'block' : 'hidden'
        )}
      >
        <label className="flex items-center mb-2 cursor-pointer">
          <input
            type="checkbox"
            checked={localWatermarkState.showWatermark}
            onChange={(e) => updateWatermarkShow(e.target.checked)}
            className="sr-only peer"
          />
          <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600" />
          <span className="ml-3 text-sm font-medium">Show Watermark</span>
        </label>

        <div className="flex items-center my-2 space-x-2">
          {(['dark', 'light', 'glassy'] as const).map((style) => (
            <button
              type="button"
              key={style}
              onClick={() => updateWatermarkStyle(style)}
              className={cn(
                'px-2 py-1 rounded text-xs transition-colors',
                localWatermarkState.watermarkStyle === style
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              )}
            >
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={localWatermarkState.watermarkText}
          onChange={(e) => updateWatermarkText(e.target.value)}
          placeholder="Watermark text"
          className="w-full bg-gray-800 text-white p-1 text-sm mt-2 rounded border border-gray-600 focus:border-teal-500 focus:outline-none"
        />
      </div>
    </>
  )
}
