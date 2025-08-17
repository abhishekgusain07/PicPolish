'use client'
import { motion } from 'motion/react'
import { Edit, RotateCcw, Download, Info } from 'lucide-react'
import { ImagePreviewProps } from '@/types/thumbnail'
import { cn } from '@/lib/utils'

export function ImagePreview({
  imageUrl,
  filename,
  fileSize,
  fileType,
  onEdit,
  onRetake,
}: ImagePreviewProps) {
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `${filename}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen p-6 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <motion.button
          onClick={onRetake}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-700/80 hover:bg-slate-200/80 dark:hover:bg-slate-600/80 transition-all duration-200 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100"
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          <RotateCcw className="w-4 h-4" />
          Take Another
        </motion.button>

        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
          Image Preview
        </h1>

        <motion.button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-700/80 hover:bg-slate-200/80 dark:hover:bg-slate-600/80 transition-all duration-200 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <Download className="w-4 h-4" />
          Download
        </motion.button>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto w-full">
        {/* Image Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex items-center justify-center"
        >
          <div className="relative max-w-full max-h-[70vh] rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-slate-800">
            <img
              src={imageUrl}
              alt={filename}
              className="max-w-full max-h-full object-contain"
              style={{ maxHeight: '70vh' }}
            />
            <div className="absolute inset-0 ring-1 ring-black/10 dark:ring-white/10 rounded-2xl pointer-events-none" />
          </div>
        </motion.div>

        {/* Info Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-80 space-y-6"
        >
          {/* Image Info */}
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <Info className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                Image Details
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Filename
                </label>
                <p className="text-slate-800 dark:text-slate-200 font-mono text-sm truncate">
                  {filename}
                </p>
              </div>

              {fileSize && (
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    File Size
                  </label>
                  <p className="text-slate-800 dark:text-slate-200">
                    {formatFileSize(fileSize)}
                  </p>
                </div>
              )}

              {fileType && (
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    File Type
                  </label>
                  <p className="text-slate-800 dark:text-slate-200">
                    {fileType}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <motion.button
              onClick={onEdit}
              className={cn(
                'w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-semibold text-white',
                'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
                'shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95'
              )}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Edit className="w-5 h-5" />
              Start Editing
            </motion.button>

            <motion.button
              onClick={onRetake}
              className={cn(
                'w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-semibold',
                'bg-slate-100/80 dark:bg-slate-700/80 hover:bg-slate-200/80 dark:hover:bg-slate-600/80',
                'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100',
                'border border-slate-200/50 dark:border-slate-600/50 transition-all duration-200'
              )}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <RotateCcw className="w-5 h-5" />
              Take Another Photo
            </motion.button>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-200/50 dark:border-amber-700/50 p-4">
            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
              💡 Pro Tips
            </h4>
            <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
              <li>• Use filters to enhance your image</li>
              <li>• Add backgrounds for better presentation</li>
              <li>• Apply transforms for creative effects</li>
              <li>• Export in different formats</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
