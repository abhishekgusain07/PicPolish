'use client'
import { motion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import { PolaroidConfig, PolaroidStyle } from '@/types/thumbnail'

interface PolaroidStyleSelectorProps {
  config: PolaroidConfig
  selectedStyle: PolaroidStyle
  onStyleSelect: (style: string) => void
  onBack: () => void
  imageCount: number
}

export function PolaroidStyleSelector({
  config,
  selectedStyle,
  onStyleSelect,
  onBack,
  imageCount,
}: PolaroidStyleSelectorProps) {
  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen flex flex-col justify-center">
      <motion.button
        onClick={onBack}
        className="mb-6 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors flex items-center gap-2"
        whileHover={{ x: -4 }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to upload
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-200 mb-4">
          Choose Your Style
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Select a polaroid style for your {imageCount} image
          {imageCount !== 1 ? 's' : ''}
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {Object.entries(config.styles).map(([key, style]) => {
          const isSelected = selectedStyle === key
          const isAvailable = imageCount === 1 || style.allowMultipleImages

          return (
            <motion.button
              key={key}
              onClick={() => isAvailable && onStyleSelect(key)}
              disabled={!isAvailable}
              className={`
                group relative p-6 rounded-2xl border-2 backdrop-blur-sm transition-all duration-300 
                ${
                  isAvailable
                    ? 'hover:scale-105 active:scale-95 cursor-pointer'
                    : 'opacity-50 cursor-not-allowed'
                }
                ${
                  isSelected
                    ? 'border-amber-500 bg-amber-100/70 dark:bg-amber-900/70'
                    : 'border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/70'
                }
                ${
                  isAvailable && !isSelected
                    ? 'hover:border-amber-300 hover:bg-white/90 dark:hover:bg-slate-700/90'
                    : ''
                }
                shadow-lg hover:shadow-xl
              `}
              whileHover={isAvailable ? { y: -4 } : {}}
              whileTap={isAvailable ? { scale: 0.98 } : {}}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {key === 'classic' && '📸'}
                  {key === 'vintage' && '✍️'}
                  {key === 'filmstrip' && '🎞️'}
                </div>

                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                  {style.name}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {style.description}
                </p>

                {!isAvailable && (
                  <div className="text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 px-2 py-1 rounded-full">
                    Single image only
                  </div>
                )}

                {isSelected && (
                  <div className="text-xs bg-amber-500 text-white px-2 py-1 rounded-full">
                    Selected
                  </div>
                )}
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
