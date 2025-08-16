import { useState } from 'react'
import { ThumbnailEditorProps } from '@/types/thumbnail'
import { useEditorState, useThumbnailApi } from '@/hooks/thumbnail-editor'
import { PreviewCard } from './PreviewCard'
import { EditorCard } from './EditorCard'

export function ThumbnailEditorLayout({
  config,
  className,
}: ThumbnailEditorProps) {
  const [activeTab, setActiveTab] = useState<
    'Settings' | 'Edit' | 'Background'
  >('Edit')

  const {
    editorState,
    backgroundState,
    watermarkState,
    imageState,
    filters,
    exportSettings,
    updateEditorState,
    updateBackgroundState,
    updateWatermarkState,
    updateFilters,
    updateExportSettings,
    updateImageState,
    resetAll,
  } = useEditorState(config)

  const { fetchThumbnail, resetImage } = useThumbnailApi({
    config,
    updateImageState,
  })

  const handleReset = () => {
    resetAll()
    resetImage()
  }

  return (
    <div
      className={`h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 lg:p-6 overflow-hidden ${className || ''}`}
    >
      <div className="flex flex-col xl:flex-row gap-4 lg:gap-6 h-full">
        <PreviewCard
          editorState={editorState}
          backgroundState={backgroundState}
          watermarkState={watermarkState}
          imageState={imageState}
          filters={filters}
          onImageFetch={fetchThumbnail}
          onReset={handleReset}
          config={config}
        />

        <EditorCard
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          editorState={editorState}
          updateEditorState={updateEditorState}
          backgroundState={backgroundState}
          updateBackgroundState={updateBackgroundState}
          watermarkState={watermarkState}
          updateWatermarkState={updateWatermarkState}
          filters={filters}
          updateFilters={updateFilters}
          exportSettings={exportSettings}
          updateExportSettings={updateExportSettings}
          onReset={handleReset}
          config={config}
        />
      </div>
    </div>
  )
}
