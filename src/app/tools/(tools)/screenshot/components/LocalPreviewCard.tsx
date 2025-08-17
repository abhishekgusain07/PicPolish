import { ArchiveRestoreIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { PreviewProps, EditorState } from '@/types/thumbnail'
import { WatermarkOverlay } from '@/components/thumbnail-editor/preview/WatermarkOverlay'
import { useAspectRatioStore } from '@/stores/aspect-ratio-store'

interface LocalImageDisplayProps {
  imageUrl: string
  editorState: EditorState
  filename: string
}

function LocalImageDisplay({
  imageUrl,
  editorState,
  filename,
}: LocalImageDisplayProps) {
  const getImageContainerStyle = () => ({
    display: 'grid',
    borderRadius: `${editorState.imageBorder}px`,
    boxShadow: `rgb(60, 58, 58) 0px 4px ${editorState.imageShadow}px 0px`,
    position: 'relative' as const,
    transform: editorState.imageTransform,
    overflow: 'hidden',
    scale: `${editorState.imageScale}`,
    transition: 'all 0.25s ease 0s',
  })

  return (
    <div style={getImageContainerStyle()}>
      <div
        style={{
          backgroundColor: 'rgb(255, 255, 255)',
          fontFamily: 'sans-serif',
          color: 'rgb(0, 0, 0)',
          borderRadius: '1px',
          borderTopWidth: 'medium',
          borderRightWidth: 'medium',
          borderLeftWidth: 'medium',
          borderTopStyle: 'none',
          borderRightStyle: 'none',
          borderLeftStyle: 'none',
          borderTopColor: 'currentcolor',
          borderRightColor: 'currentcolor',
          borderLeftColor: 'currentcolor',
          borderImage: 'none',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        <div>
          <img
            alt={filename}
            src={imageUrl}
            style={{ width: '100%', height: 'auto', display: 'block' }}
            onError={() => {
              console.error('Failed to load local image:', imageUrl)
            }}
          />
        </div>
      </div>
    </div>
  )
}

function LocalThumbnailPreview({
  editorState,
  backgroundState,
  watermarkState,
  imageState,
  filters,
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
        className="rounded-2xl shadow-2xl transition-all duration-500 ease-in-out"
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
        <LocalImageDisplay
          imageUrl={imageState.url}
          editorState={editorState}
          filename="local-image"
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

export function PreviewCard(props: PreviewProps) {
  return (
    <div className="flex-1 xl:w-[70%] order-2 xl:order-1 h-full">
      <Card className="h-full backdrop-blur-sm bg-white/70 dark:bg-slate-800/70 border-slate-200/50 dark:border-slate-700/50 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50">
        <CardContent className="p-0 h-full">
          <LocalThumbnailPreview {...props} />
        </CardContent>
      </Card>
    </div>
  )
}
