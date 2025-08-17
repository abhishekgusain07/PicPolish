'use client'
import { useState } from 'react'
import { motion } from 'motion/react'
import { Upload, Monitor, Camera, Image } from 'lucide-react'
import { CaptureType } from '@/types/thumbnail'
import { FileUpload } from '@/components/file-upload'
import { cn } from '@/lib/utils'

interface ImageSourceSelectorProps {
  onFileUpload: (files: File[]) => void
  onScreenCapture: (captureType: CaptureType) => void
}

export function ImageSourceSelector({
  onFileUpload,
  onScreenCapture,
}: ImageSourceSelectorProps) {
  const [selectedSource, setSelectedSource] = useState<
    'upload' | 'capture' | null
  >(null)

  const captureOptions = [
    {
      type: 'screen' as CaptureType,
      icon: Monitor,
      title: 'Full Screen',
      description: 'Capture your entire screen',
      color: 'from-blue-500 to-blue-600',
    },
    {
      type: 'window' as CaptureType,
      icon: Camera,
      title: 'Window',
      description: 'Capture a specific window',
      color: 'from-green-500 to-green-600',
    },
    {
      type: 'tab' as CaptureType,
      icon: Image,
      title: 'Browser Tab',
      description: 'Capture current browser tab',
      color: 'from-purple-500 to-purple-600',
    },
  ]

  const handleCaptureClick = (captureType: CaptureType) => {
    onScreenCapture(captureType)
  }

  const renderUploadSection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 text-center">
        Upload Image
      </h3>
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl p-6">
        <FileUpload onChange={onFileUpload} />
        <div className="mt-4 text-sm text-slate-600 dark:text-slate-400 text-center">
          Supported formats: PNG, JPG, JPEG, WEBP • Max size: 10MB
        </div>
      </div>
    </motion.div>
  )

  const renderCaptureSection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 text-center">
        Take Screenshot
      </h3>
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
        {captureOptions.map((option) => {
          const IconComponent = option.icon
          return (
            <motion.button
              key={option.type}
              onClick={() => handleCaptureClick(option.type)}
              className={cn(
                'group relative p-6 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95',
                'bg-white/70 dark:bg-slate-800/70 hover:bg-white/90 dark:hover:bg-slate-700/90',
                'shadow-lg hover:shadow-xl'
              )}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-r',
                  option.color,
                  'group-hover:scale-110 transition-transform duration-200'
                )}
              >
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                {option.title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {option.description}
              </p>
            </motion.button>
          )
        })}
      </div>
      <div className="mt-4 text-sm text-slate-600 dark:text-slate-400 text-center">
        Your browser will request permission to access your screen
      </div>
    </motion.div>
  )

  if (selectedSource === 'upload') {
    return (
      <div className="max-w-4xl mx-auto p-6 min-h-screen flex flex-col justify-center">
        <motion.button
          onClick={() => setSelectedSource(null)}
          className="mb-6 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors flex items-center gap-2"
          whileHover={{ x: -4 }}
        >
          ← Back to options
        </motion.button>
        {renderUploadSection()}
      </div>
    )
  }

  if (selectedSource === 'capture') {
    return (
      <div className="max-w-4xl mx-auto p-6 min-h-screen flex flex-col justify-center">
        <motion.button
          onClick={() => setSelectedSource(null)}
          className="mb-6 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors flex items-center gap-2"
          whileHover={{ x: -4 }}
        >
          ← Back to options
        </motion.button>
        {renderCaptureSection()}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-200 mb-4">
          Screenshot Tool
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Upload an image or capture your screen, then edit with powerful tools
        </p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2 max-w-2xl mx-auto">
        <motion.button
          onClick={() => setSelectedSource('upload')}
          className={cn(
            'group relative p-8 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95',
            'bg-white/70 dark:bg-slate-800/70 hover:bg-white/90 dark:hover:bg-slate-700/90',
            'shadow-xl hover:shadow-2xl'
          )}
          whileHover={{ y: -8 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 group-hover:scale-110 transition-transform duration-200 mx-auto">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">
            Upload Image
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Select an image file from your device to edit
          </p>
        </motion.button>

        <motion.button
          onClick={() => setSelectedSource('capture')}
          className={cn(
            'group relative p-8 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95',
            'bg-white/70 dark:bg-slate-800/70 hover:bg-white/90 dark:hover:bg-slate-700/90',
            'shadow-xl hover:shadow-2xl'
          )}
          whileHover={{ y: -8 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:scale-110 transition-transform duration-200 mx-auto">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">
            Take Screenshot
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Capture your screen, window, or browser tab
          </p>
        </motion.button>
      </div>
    </div>
  )
}
