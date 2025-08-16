import { useState, useEffect, useRef } from 'react'
import { Sketch } from '@uiw/react-color'
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
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTempColor(color)
  }, [color])

  useEffect(() => {
    if (isOpen) {
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
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleColorChange = (newColor: string) => {
    setTempColor(newColor)
    onColorChange(newColor)
  }

  const handleSave = () => {
    onSave(tempColor)
    onClose()
  }

  const modalStyle = {
    left: Math.max(16, Math.min(position.x - 150, window.innerWidth - 300)),
    top: Math.max(16, Math.min(position.y + 40, window.innerHeight - 500)),
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-start pointer-events-none">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto" />
      <div
        ref={modalRef}
        className="absolute bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 p-4 min-w-[300px] pointer-events-auto"
        style={modalStyle}
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
            <Sketch
              color={tempColor}
              onChange={(color) => handleColorChange(color.hex)}
              style={{ boxShadow: 'none' }}
            />
          </div>

          {/* Color Preview and Input */}
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg border-2 border-slate-300 dark:border-slate-600 shadow-sm"
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
}
