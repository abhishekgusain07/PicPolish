import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { HexColorPicker } from 'react-colorful'
import { cn } from '@/lib/utils'
import { X, Check } from 'lucide-react'

interface ColorPickerModalProps {
  isOpen: boolean
  color: string
  position: { x: number; y: number }
  onColorChange: (color: string) => void
  onClose: () => void
  onSave: (color: string) => void
}

export function ColorPickerModal({
  isOpen,
  color,
  position,
  onColorChange,
  onClose,
  onSave,
}: ColorPickerModalProps) {
  const [tempColor, setTempColor] = useState(color)
  const [mounted, setMounted] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle mounting for SSR
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (color && color !== tempColor) {
      console.log('Color prop changed:', color)
      setTempColor(color)
    }
  }, [color])

  useEffect(() => {
    if (isOpen) {
      console.log('Modal opened with color:', tempColor, 'position:', position)

      // Prevent body scroll
      document.body.style.overflow = 'hidden'

      const handleClickOutside = (event: MouseEvent) => {
        if (
          modalRef.current &&
          !modalRef.current.contains(event.target as Node)
        ) {
          onClose()
        }
      }

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose()
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)

      return () => {
        document.body.style.overflow = ''
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleEscape)
      }
    } else {
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const handleColorChange = (newColor: string) => {
    console.log('Color changed to:', newColor)
    setTempColor(newColor)
    onColorChange(newColor)
  }

  const handleSave = () => {
    console.log('Saving color:', tempColor)
    onSave(tempColor)
    onClose()
  }

  // Don't render during SSR
  if (!mounted || !isOpen) return null

  // Calculate better positioning - center the modal
  const modalStyle: React.CSSProperties = {
    position: 'fixed',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10000,
  }

  const modalContent = (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 p-6 min-w-[320px] max-w-sm mx-4"
        style={{ zIndex: 10001 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">
            Pick Color
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="size-4 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Color Picker */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <HexColorPicker
              color={tempColor}
              onChange={handleColorChange}
              style={{
                width: '200px',
                height: '150px',
              }}
            />
          </div>

          {/* Color Preview and Input */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg border-2 border-slate-300 dark:border-slate-600 shadow-sm flex-shrink-0"
              style={{ backgroundColor: tempColor }}
            />
            <input
              type="text"
              value={tempColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className={cn(
                'flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600',
                'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                'text-sm font-mono'
              )}
              placeholder="#ffffff"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className={cn(
                'flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600',
                'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300',
                'hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors',
                'font-medium text-sm'
              )}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className={cn(
                'flex-1 px-4 py-2 rounded-lg',
                'bg-blue-500 hover:bg-blue-600 text-white',
                'transition-colors font-medium text-sm',
                'flex items-center justify-center gap-2'
              )}
            >
              <Check className="size-4" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
