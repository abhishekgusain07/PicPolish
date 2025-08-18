'use client'
import { motion } from 'motion/react'
import { Upload, Image, Camera, X } from 'lucide-react'
import { PolaroidConfig } from '@/types/thumbnail'
import { useState, useRef, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface PolaroidImageUploadProps {
  onFileUpload: (files: File[]) => void
  config: PolaroidConfig
}

interface PreviewFile {
  file: File
  preview: string
  valid: boolean
  error?: string
}

export function PolaroidImageUpload({
  onFileUpload,
  config,
}: PolaroidImageUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<PreviewFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      selectedFiles.forEach(({ preview }) => {
        if (preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview)
        }
      })
    }
  }, [])

  const validateFile = useCallback(
    (file: File): { valid: boolean; error?: string } => {
      if (!config.supportedTypes.includes(file.type)) {
        return {
          valid: false,
          error: `Unsupported file type: ${file.type}`,
        }
      }

      if (file.size > config.maxFileSize) {
        const maxSizeMB = config.maxFileSize / (1024 * 1024)
        return {
          valid: false,
          error: `File too large: ${(file.size / (1024 * 1024)).toFixed(2)}MB (max ${maxSizeMB}MB)`,
        }
      }

      return { valid: true }
    },
    [config]
  )

  const handleFileSelection = useCallback(
    (newFiles: File[]) => {
      const processedFiles = newFiles.map((file) => {
        const validation = validateFile(file)
        return {
          file,
          preview: URL.createObjectURL(file),
          valid: validation.valid,
          error: validation.error,
        }
      })

      // Show validation errors
      const invalidFiles = processedFiles.filter((f) => !f.valid)
      if (invalidFiles.length > 0) {
        invalidFiles.forEach(({ error }) => {
          if (error) toast.error(error)
        })
      }

      // Filter valid files and respect max limit
      const validFiles = processedFiles.filter((f) => f.valid)
      const remainingSlots = config.maxImages - selectedFiles.length
      const filesToAdd = validFiles.slice(0, remainingSlots)

      if (validFiles.length > remainingSlots) {
        toast.warning(`Only ${remainingSlots} more image(s) can be added`)
      }

      setSelectedFiles((prev) => [...prev, ...filesToAdd])

      // Show success message
      if (filesToAdd.length > 0) {
        toast.success(`${filesToAdd.length} image(s) added successfully`)
      }
    },
    [selectedFiles.length, config.maxImages, validateFile]
  )

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => {
      const fileToRemove = prev[index]
      if (fileToRemove?.preview.startsWith('blob:')) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return prev.filter((_, i) => i !== index)
    })
  }, [])

  const handleUpload = useCallback(() => {
    const validFiles = selectedFiles.filter((f) => f.valid)
    if (validFiles.length > 0) {
      onFileUpload(validFiles.map((f) => f.file))
    } else {
      toast.error('No valid files to upload')
    }
  }, [selectedFiles, onFileUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    accept: {
      'image/*': config.supportedTypes.map((type) =>
        type.replace('image/', '.')
      ),
    },
    maxFiles: config.maxImages,
    maxSize: config.maxFileSize,
    onDrop: handleFileSelection,
    noClick: false,
  })
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
          {/* Multi-file dropzone */}
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200',
              isDragActive
                ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                : 'border-slate-300 dark:border-slate-600 hover:border-amber-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Upload className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  {isDragActive
                    ? 'Drop your images here'
                    : 'Upload Your Photos'}
                </h4>
                <p className="text-slate-600 dark:text-slate-400">
                  Drag and drop up to {config.maxImages} images, or click to
                  browse
                </p>
              </div>
            </div>
          </div>

          {/* Selected files preview */}
          {selectedFiles.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-medium text-slate-800 dark:text-slate-200">
                  Selected Images ({selectedFiles.length})
                </h5>
                {selectedFiles.length > 0 && (
                  <button
                    onClick={handleUpload}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Create Polaroids →
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {selectedFiles.map((previewFile, index) => (
                  <div key={index} className="relative group">
                    <div
                      className={cn(
                        'aspect-square bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden border-2',
                        previewFile.valid
                          ? 'border-green-200 dark:border-green-700'
                          : 'border-red-200 dark:border-red-700'
                      )}
                    >
                      <img
                        src={previewFile.preview}
                        alt={previewFile.file.name}
                        className="w-full h-full object-cover"
                      />
                      {!previewFile.valid && (
                        <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                          <span className="text-red-600 dark:text-red-400 text-xs font-medium px-2 py-1 bg-white/90 dark:bg-slate-800/90 rounded">
                            Invalid
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="mt-1">
                      <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                        {previewFile.file.name}
                      </p>
                      {previewFile.error && (
                        <p className="text-xs text-red-500 dark:text-red-400 truncate">
                          {previewFile.error}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
