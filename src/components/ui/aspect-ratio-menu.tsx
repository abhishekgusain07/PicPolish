'use client'
import { motion, AnimatePresence } from 'motion/react'
import { AspectRatio, ASPECT_RATIOS } from '@/types/thumbnail'
import { cn } from '@/lib/utils'
import { useEffect, useRef } from 'react'

interface AspectRatioMenuProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (ratio: AspectRatio) => void
  currentRatio: AspectRatio
  className?: string
}

export function AspectRatioMenu({
  isOpen,
  onClose,
  onSelect,
  currentRatio,
  className,
}: AspectRatioMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const handleRatioSelect = (ratio: AspectRatio) => {
    onSelect(ratio)
    onClose()
  }

  const getRatioPreview = (ratio: AspectRatio) => {
    const baseSize = 24
    const maxDimension = baseSize

    let width, height
    if (ratio.width > ratio.height) {
      width = maxDimension
      height = maxDimension / ratio.ratio
    } else {
      height = maxDimension
      width = maxDimension * ratio.ratio
    }

    return { width, height }
  }

  console.log('AspectRatioMenu - isOpen:', isOpen)

  if (!isOpen) return null

  return (
    <div
      ref={menuRef}
      className={cn(
        'fixed bottom-20 left-1/2 transform -translate-x-1/2 z-[9999]',
        'bg-white dark:bg-neutral-900',
        'border-2 border-red-500', // Temporary red border to see it
        'rounded-2xl shadow-2xl p-4',
        'min-w-[280px] max-w-[320px]',
        className
      )}
      style={{
        position: 'fixed',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
      }}
    >
      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 px-2">
        Select Aspect Ratio
      </div>

      <div className="grid grid-cols-2 gap-2">
        {ASPECT_RATIOS.map((ratio) => {
          const isSelected = currentRatio.name === ratio.name
          const { width, height } = getRatioPreview(ratio)

          return (
            <motion.button
              key={ratio.name}
              onClick={() => handleRatioSelect(ratio)}
              className={cn(
                'flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200',
                'hover:bg-slate-100/80 dark:hover:bg-slate-800/80',
                'border border-transparent hover:border-slate-200/50 dark:hover:border-slate-700/50',
                isSelected &&
                  'bg-blue-50/80 dark:bg-blue-900/30 border-blue-200/50 dark:border-blue-700/50'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Visual Preview */}
              <div className="flex items-center justify-center w-8 h-8">
                <div
                  className={cn(
                    'border-2 rounded transition-colors',
                    isSelected
                      ? 'border-blue-400 bg-blue-100/50 dark:border-blue-500 dark:bg-blue-900/50'
                      : 'border-slate-400 dark:border-slate-500'
                  )}
                  style={{ width: `${width}px`, height: `${height}px` }}
                />
              </div>

              {/* Label */}
              <div className="text-xs text-center">
                <div
                  className={cn(
                    'font-medium',
                    isSelected
                      ? 'text-blue-700 dark:text-blue-300'
                      : 'text-slate-700 dark:text-slate-300'
                  )}
                >
                  {ratio.label}
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-[10px] mt-0.5">
                  {ratio.width}×{ratio.height}
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Footer tip */}
      <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
        <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
          💡 Click outside to close
        </div>
      </div>
    </div>
  )
}
