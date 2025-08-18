'use client'
import { motion } from 'motion/react'
import { Upload, Image, Camera } from 'lucide-react'
import { PolaroidConfig } from '@/types/thumbnail'
import { FileUpload } from '@/components/file-upload'

interface PolaroidImageUploadProps {
  onFileUpload: (files: File[]) => void
  config: PolaroidConfig
}

export function PolaroidImageUpload({
  onFileUpload,
  config,
}: PolaroidImageUploadProps) {
  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
            <Camera className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-200 mb-4">
          Polaroid Images
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Transform your photos into beautiful polaroid-style images with custom
          frames and text
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full"
      >
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 text-center">
          Upload Your Photos
        </h3>

        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl p-6">
          <FileUpload onChange={onFileUpload} />

          <div className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>Up to {config.maxImages} images</span>
              </div>
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                <span>PNG, JPG, WEBP</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                  Max {config.maxFileSize / (1024 * 1024)}MB each
                </span>
              </div>
            </div>

            <div className="text-center pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
              <p className="text-xs opacity-75">
                Perfect for creating vintage-style memories and film strip
                collages
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto"
      >
        <div className="text-center p-4 bg-white/40 dark:bg-slate-800/40 rounded-xl border border-slate-200/30 dark:border-slate-700/30">
          <div className="text-2xl mb-2">📸</div>
          <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
            Classic Style
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Clean white borders with decorative elements
          </p>
        </div>

        <div className="text-center p-4 bg-white/40 dark:bg-slate-800/40 rounded-xl border border-slate-200/30 dark:border-slate-700/30">
          <div className="text-2xl mb-2">✍️</div>
          <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
            Vintage Style
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Aged look with custom handwritten text
          </p>
        </div>

        <div className="text-center p-4 bg-white/40 dark:bg-slate-800/40 rounded-xl border border-slate-200/30 dark:border-slate-700/30">
          <div className="text-2xl mb-2">🎞️</div>
          <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
            Film Strip
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Multiple photos in vintage film arrangement
          </p>
        </div>
      </motion.div>
    </div>
  )
}
