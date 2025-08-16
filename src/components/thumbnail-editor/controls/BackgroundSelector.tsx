import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import {
  BackgroundSelectorProps,
  SubActiveTab,
  ColorPickerState,
} from '@/types/thumbnail'
import { Gradients } from '@/constants/gradient'
import { PlainColors } from '@/constants/plainColors'
import { ColorPickerModal } from '@/components/ui/color-picker-modal'
import {
  extractHexColorsWithValidation,
  reconstructGradient,
  updateGradientColor,
  sanitizeHexColor,
} from '@/lib/color-utils'

export function BackgroundSelector({
  backgroundState,
  updateBackgroundState,
}: BackgroundSelectorProps) {
  const [colorPicker, setColorPicker] = useState<ColorPickerState>({
    isOpen: false,
    colorIndex: 0,
    position: { x: 0, y: 0 },
  })

  // Debug logging
  console.log('BackgroundSelector render:', {
    gradientColors: backgroundState.gradientColors,
    selectedGradient: backgroundState.selectedGradient,
    colorPickerState: colorPicker,
  })

  const handleSubActiveTabChange = (tab: SubActiveTab) => {
    updateBackgroundState({ subActiveTab: tab })
  }

  const handleGradientChange = (gradient: string) => {
    console.log('Gradient changed:', gradient)
    const colors = extractHexColorsWithValidation(gradient)
    console.log('Extracted colors:', colors)

    updateBackgroundState({
      selectedGradient: gradient,
      linearGradient: gradient,
      gradientColors: colors,
    })
  }

  const handleColorSwatchClick = (event: React.MouseEvent, index: number) => {
    event.preventDefault()
    event.stopPropagation()
    const rect = event.currentTarget.getBoundingClientRect()

    setColorPicker({
      isOpen: true,
      colorIndex: index,
      position: {
        x: rect.left,
        y: rect.top,
      },
    })
  }

  const handleColorChange = (newColor: string) => {
    console.log(
      'Color change requested:',
      newColor,
      'at index:',
      colorPicker.colorIndex
    )
    const currentColors = backgroundState.gradientColors || [
      '#48dbfb',
      '#6c5ce7',
    ]

    const updatedColors = updateGradientColor(
      currentColors,
      colorPicker.colorIndex,
      newColor
    )
    const newGradient = reconstructGradient(updatedColors)

    console.log('Updated colors:', updatedColors, 'new gradient:', newGradient)

    updateBackgroundState({
      gradientColors: updatedColors,
      linearGradient: newGradient,
      selectedGradient: newGradient,
    })
  }

  const handleColorSave = (finalColor: string) => {
    console.log(
      'Color save requested:',
      finalColor,
      'at index:',
      colorPicker.colorIndex
    )
    const currentColors = backgroundState.gradientColors || [
      '#48dbfb',
      '#6c5ce7',
    ]

    const updatedColors = updateGradientColor(
      currentColors,
      colorPicker.colorIndex,
      finalColor
    )
    const newGradient = reconstructGradient(updatedColors)

    console.log(
      'Final colors saved:',
      updatedColors,
      'final gradient:',
      newGradient
    )

    updateBackgroundState({
      gradientColors: updatedColors,
      linearGradient: newGradient,
      selectedGradient: newGradient,
    })
  }

  const handleColorPickerClose = () => {
    setColorPicker((prev) => ({ ...prev, isOpen: false }))
  }

  const handleSolidColorChange = (color: string) => {
    updateBackgroundState({
      selectedSolidColor: color,
      solidColor: color,
    })
  }

  const handleImageChange = (imageNumber: number) => {
    updateBackgroundState({
      backgroundImage: imageNumber,
      selectedImage: imageNumber,
    })
  }

  return (
    <div className="space-y-4">
      {/* Sub-menu tabs */}
      <div className="w-full flex flex-row items-center justify-center gap-1 rounded-2xl p-2 bg-slate-50/80 dark:bg-slate-700/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50">
        <button
          className={cn(
            'flex-1 py-2 px-3 rounded-xl font-medium text-sm transition-all duration-200',
            backgroundState.subActiveTab === 'Gradient'
              ? 'bg-blue-500 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-600/50 hover:text-slate-800 dark:hover:text-slate-200'
          )}
          onClick={() => handleSubActiveTabChange('Gradient')}
        >
          Gradient
        </button>
        <button
          className={cn(
            'flex-1 py-2 px-3 rounded-xl font-medium text-sm transition-all duration-200',
            backgroundState.subActiveTab === 'Image'
              ? 'bg-blue-500 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-600/50 hover:text-slate-800 dark:hover:text-slate-200'
          )}
          onClick={() => handleSubActiveTabChange('Image')}
        >
          Image
        </button>
        <button
          className={cn(
            'flex-1 py-2 px-3 rounded-xl font-medium text-sm transition-all duration-200',
            backgroundState.subActiveTab === 'Solid'
              ? 'bg-blue-500 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-600/50 hover:text-slate-800 dark:hover:text-slate-200'
          )}
          onClick={() => handleSubActiveTabChange('Solid')}
        >
          Solid
        </button>
      </div>

      {/* Gradient tab */}
      {backgroundState.subActiveTab === 'Gradient' && (
        <div className="space-y-4">
          <Input type="Color" className="w-full h-10" />
          <div className="flex mt-3 gap-2">
            {(backgroundState.gradientColors &&
            backgroundState.gradientColors.length > 0
              ? backgroundState.gradientColors
              : ['#48dbfb', '#6c5ce7']
            ).map((color, index) => (
              <button
                key={`${color}-${index}`}
                onClick={(e) => handleColorSwatchClick(e, index)}
                className="relative group hover:scale-105 transition-transform duration-200"
                style={{
                  background: color,
                  height: '36px',
                  width: '36px',
                  borderRadius: '8px',
                  border: '2px solid rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                }}
              >
                <span className="absolute -top-1 -right-1 bg-white dark:bg-slate-800 shadow-md flex justify-center items-center rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 24 24"
                    height="14px"
                    width="14px"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-slate-600 dark:text-slate-300"
                  >
                    <path fill="none" d="M0 0h24v24H0V0z" />
                    <path d="m17.66 5.41.92.92-2.69 2.69-.92-.92 2.69-2.69M17.67 3c-.26 0-.51.1-.71.29l-3.12 3.12-1.93-1.91-1.41 1.41 1.42 1.42L3 16.25V21h4.75l8.92-8.92 1.42 1.42 1.41-1.41-1.92-1.92 3.12-3.12c.4-.4.4-1.03.01-1.42l-2.34-2.34c-.2-.19-.45-.29-.7-.29zM6.92 19 5 17.08l8.06-8.06 1.92 1.92L6.92 19z" />
                  </svg>
                </span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3 max-h-[20vh] md:max-h-[40vh] overflow-y-auto p-3 sm:p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/50 dark:border-slate-600/50">
            {Gradients.map((gradient) => (
              <button
                className={cn(
                  'aspect-square rounded-xl border-2 transition-all duration-200 hover:scale-105 active:scale-95',
                  backgroundState.selectedGradient === gradient
                    ? 'border-blue-500 shadow-lg shadow-blue-200/50 dark:shadow-blue-900/50 scale-105'
                    : 'border-slate-300/50 dark:border-slate-500/50 hover:border-slate-400 dark:hover:border-slate-400'
                )}
                style={{ background: gradient }}
                key={gradient}
                onClick={() => handleGradientChange(gradient)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Image tab */}
      {backgroundState.subActiveTab === 'Image' && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3 max-h-[20vh] md:max-h-[40vh] overflow-y-auto p-3 sm:p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/50 dark:border-slate-600/50">
          {Array.from({ length: 70 }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              className={cn(
                'aspect-square rounded-xl border-2 transition-all duration-200 hover:scale-105 active:scale-95 overflow-hidden',
                backgroundState.selectedImage === number
                  ? 'border-blue-500 shadow-lg shadow-blue-200/50 dark:shadow-blue-900/50 scale-105'
                  : 'border-slate-300/50 dark:border-slate-500/50 hover:border-slate-400 dark:hover:border-slate-400'
              )}
              onClick={() => handleImageChange(number)}
            >
              <img
                src={`/test${number}.webp`}
                alt={`bg ${number}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Solid tab */}
      {backgroundState.subActiveTab === 'Solid' && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3 max-h-[20vh] md:max-h-[40vh] overflow-y-auto p-3 sm:p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/50 dark:border-slate-600/50">
          {PlainColors.map((plainColor) => (
            <button
              className={cn(
                'aspect-square rounded-xl border-2 transition-all duration-200 hover:scale-105 active:scale-95',
                backgroundState.selectedSolidColor === plainColor
                  ? 'border-blue-500 shadow-lg shadow-blue-200/50 dark:shadow-blue-900/50 scale-105'
                  : 'border-slate-300/50 dark:border-slate-500/50 hover:border-slate-400 dark:hover:border-slate-400'
              )}
              style={{ background: plainColor }}
              key={plainColor}
              onClick={() => handleSolidColorChange(plainColor)}
            />
          ))}
        </div>
      )}

      {/* Color Picker Modal */}
      <ColorPickerModal
        isOpen={colorPicker.isOpen}
        color={sanitizeHexColor(
          (backgroundState.gradientColors || ['#48dbfb', '#6c5ce7'])[
            colorPicker.colorIndex
          ] || '#48dbfb',
          '#48dbfb'
        )}
        position={colorPicker.position}
        onColorChange={handleColorChange}
        onSave={handleColorSave}
        onClose={handleColorPickerClose}
      />
    </div>
  )
}
