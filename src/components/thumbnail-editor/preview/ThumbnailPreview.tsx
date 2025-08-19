import { ArchiveRestoreIcon } from 'lucide-react'
import { PreviewProps } from '@/types/thumbnail'
import { ImageDisplay } from './ImageDisplay'
import { WatermarkOverlay } from './WatermarkOverlay'
import { OverlayLayer } from './OverlayLayer'
import { useAspectRatioStore } from '@/stores/aspect-ratio-store'

export function ThumbnailPreview({
  editorState,
  backgroundState,
  watermarkState,
  imageState,
  filters,
  onImageFetch,
  onReset,
  config,
}: PreviewProps) {
  const { containerDimensions } = useAspectRatioStore()
  const getBackgroundStyle = () => {
    switch (backgroundState.subActiveTab) {
      case 'Gradient':
        return backgroundState.linearGradient
      case 'Solid':
        return backgroundState.solidColor
      case 'Image':
        return `url(/test${backgroundState.backgroundImage}.webp)`
      default:
        return backgroundState.linearGradient
    }
  }

  const getFilterStyle = () => {
    return `brightness(${filters.brightness}) contrast(${filters.contrast}) grayscale(${filters.grayscale}) blur(${filters.blur}px) hue-rotate(${filters.hueRotate}deg) invert(${filters.invert}) opacity(${filters.opacity}) saturate(${filters.saturate}) sepia(${filters.sepia})`
  }

  const getPaddingStyle = () => {
    const value = editorState.paddingValue
    const [top, right, bottom, left] = editorState.imagePosition.split(' ')
    return `${top === '0' ? '0rem' : top === '1' ? `${value}rem` : `${2 * value}rem`} ${right === '0' ? '0rem' : right === '1' ? `${value}rem` : `${2 * value}rem`} ${bottom === '0' ? '0rem' : bottom === '1' ? `${value}rem` : `${2 * value}rem`} ${left === '0' ? '0rem' : left === '1' ? `${value}rem` : `${2 * value}rem`}`
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full h-full min-h-[600px]">
      <div
        id="thumbnail-container"
        className="rounded-2xl shadow-2xl transition-all duration-500 ease-in-out capture-mode-no-container-shadow"
        style={{
          padding: getPaddingStyle(),
          margin: '0px',
          background: getBackgroundStyle(),
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: getFilterStyle(),
          overflow: 'hidden',
          opacity: '1',
          scrollMargin: '0px',
          width: `${containerDimensions.width}px`,
          height: `${containerDimensions.height}px`,
          maxWidth: '90vw',
          maxHeight: '70vh',
        }}
      >
        <ImageDisplay
          imageState={imageState}
          editorState={editorState}
          onImageFetch={onImageFetch}
          config={config}
        />

        <OverlayLayer
          selectedOverlay={backgroundState.selectedOverlay}
          overlayOpacity={backgroundState.overlayOpacity}
        />

        <WatermarkOverlay watermarkState={watermarkState} config={config} />
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={onReset}
          className="group flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100/80 dark:bg-slate-700/80 hover:bg-slate-200/80 dark:hover:bg-slate-600/80 transition-all duration-200 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100"
        >
          <ArchiveRestoreIcon className="size-4 transition-transform group-hover:rotate-180 duration-300" />
          Reset
        </button>
      </div>
    </div>
  )
}
