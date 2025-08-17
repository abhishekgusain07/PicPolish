'use client'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'motion/react'
import { LocalImageEditorProps } from '@/types/thumbnail'
import { useEditorState } from '@/hooks/thumbnail-editor'
import { PreviewCard } from './LocalPreviewCard'
import { EditorCard } from '@/components/thumbnail-editor/layout/EditorCard'

export function LocalImageEditor({
  imageUrl,
  filename,
  onBack,
  config,
}: LocalImageEditorProps) {
  const [activeTab, setActiveTab] = useState<
    'Settings' | 'Edit' | 'Background'
  >('Edit')

  // Create a platform config that works with local images
  const localConfig = {
    ...config,
    apiEndpoint: '', // Not needed for local images
    validationRules: undefined, // Not needed for local images
  }

  const {
    editorState,
    backgroundState,
    watermarkState,
    filters,
    exportSettings,
    updateEditorState,
    updateBackgroundState,
    updateWatermarkState,
    updateFilters,
    updateExportSettings,
    resetAll,
  } = useEditorState(localConfig)

  // Mock image state for local images
  const imageState = {
    url: imageUrl,
    isLoading: false,
    error: false,
  }

  const handleReset = () => {
    resetAll()
  }

  // No-op function for image fetch since we're working with local images
  const handleImageFetch = async () => {
    // No-op for local images
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 lg:p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <motion.button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-700/80 hover:bg-slate-200/80 dark:hover:bg-slate-600/80 transition-all duration-200 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100"
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Preview
        </motion.button>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          Editing: {filename}
        </h1>
        <div className="w-32" /> {/* Spacer for center alignment */}
      </div>

      {/* Editor Content */}
      <div className="flex flex-col xl:flex-row gap-4 lg:gap-6 h-[calc(100vh-80px)] p-4 lg:p-6 pt-0">
        <PreviewCard
          editorState={editorState}
          backgroundState={backgroundState}
          watermarkState={watermarkState}
          imageState={imageState}
          filters={filters}
          onImageFetch={handleImageFetch}
          onReset={handleReset}
          config={localConfig}
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
          config={localConfig}
        />
      </div>
    </div>
  )
}
