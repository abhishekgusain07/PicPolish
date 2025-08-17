'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { Download, Image, FileText, Palette } from 'lucide-react'

interface SaveImageModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (format: ImageFormat) => void
}

type ImageFormat = 'jpeg' | 'webp' | 'png'

interface FormatOption {
  id: ImageFormat
  name: string
  description: string
  icon: React.ReactNode
  extension: string
  quality?: boolean
}

const formatOptions: FormatOption[] = [
  {
    id: 'jpeg',
    name: 'JPEG',
    description: 'High compatibility, smaller file size',
    icon: <Image className="w-5 h-5" />,
    extension: '.jpg',
    quality: true,
  },
  {
    id: 'webp',
    name: 'WebP',
    description: 'Modern format, excellent compression',
    icon: <Palette className="w-5 h-5" />,
    extension: '.webp',
    quality: true,
  },
  {
    id: 'png',
    name: 'PNG',
    description: 'Lossless quality, supports transparency',
    icon: <FileText className="w-5 h-5" />,
    extension: '.png',
    quality: false,
  },
]

export function SaveImageModal({
  isOpen,
  onClose,
  onSave,
}: SaveImageModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ImageFormat>('png')

  const handleSave = () => {
    onSave(selectedFormat)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Save Image
          </DialogTitle>
          <DialogDescription>
            Choose your preferred image format for download
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Format Selection */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Select Format
            </h4>
            <div className="grid gap-3">
              {formatOptions.map((option) => (
                <motion.button
                  key={option.id}
                  onClick={() => setSelectedFormat(option.id)}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200',
                    'hover:scale-[1.02] active:scale-[0.98]',
                    selectedFormat === option.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  )}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-lg',
                      selectedFormat === option.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    )}
                  >
                    {option.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {option.name}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                        {option.extension}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {option.description}
                    </p>
                  </div>
                  <div
                    className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                      selectedFormat === option.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-slate-300 dark:border-slate-600'
                    )}
                  >
                    <AnimatePresence>
                      {selectedFormat === option.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="w-2 h-2 rounded-full bg-white"
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className={cn(
                'flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600',
                'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300',
                'hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors',
                'font-medium text-sm'
              )}
            >
              Cancel
            </button>
            <motion.button
              onClick={handleSave}
              className={cn(
                'flex-1 px-4 py-3 rounded-xl',
                'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
                'text-white font-medium text-sm',
                'transition-all duration-200 flex items-center justify-center gap-2'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-4 h-4" />
              Download{' '}
              {formatOptions.find((f) => f.id === selectedFormat)?.name}
            </motion.button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
