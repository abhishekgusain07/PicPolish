'use client'
import { motion } from 'motion/react'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { PolaroidState, PolaroidConfig } from '@/types/thumbnail'

interface PolaroidPreviewProps {
  state: PolaroidState
  config: PolaroidConfig
  onBack: () => void
  onReset: () => void
}

export function PolaroidPreview({
  state,
  config,
  onBack,
  onReset,
}: PolaroidPreviewProps) {
  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <motion.button
          onClick={onBack}
          className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors flex items-center gap-2"
          whileHover={{ x: -4 }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to editor
        </motion.button>

        <motion.button
          onClick={onReset}
          className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <RotateCcw className="w-4 h-4" />
          Start over
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          Your Polaroid is Ready!
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Use the floating controls to save or copy your image
        </p>
      </motion.div>

      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          id="thumbnail-container"
          className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl p-8"
        >
          <div className="aspect-square w-96 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">
                {state.style === 'classic' && '📸'}
                {state.style === 'vintage' && '✍️'}
                {state.style === 'filmstrip' && '🎞️'}
              </div>
              <span className="text-slate-500 dark:text-slate-400 text-lg">
                {config.styles[state.style].name} Preview
              </span>
              <div className="mt-2 text-sm text-slate-400 dark:text-slate-500">
                {state.images.length} image
                {state.images.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {config.styles[state.style].hasTextArea && (
            <div className="mt-4 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                {state.textOverlay.text}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                {state.textOverlay.date}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900 rounded-full text-amber-700 dark:text-amber-300 text-sm">
          <span>💡</span>
          Use the floating controls at the bottom to save or copy your polaroid
        </div>
      </motion.div>
    </div>
  )
}
