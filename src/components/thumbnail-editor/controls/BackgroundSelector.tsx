import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { BackgroundSelectorProps, SubActiveTab } from '@/types/thumbnail'
import { Gradients } from '@/constants/gradient'
import { PlainColors } from '@/constants/plainColors'

export function BackgroundSelector({
  backgroundState,
  updateBackgroundState,
}: BackgroundSelectorProps) {
  const handleSubActiveTabChange = (tab: SubActiveTab) => {
    updateBackgroundState({ subActiveTab: tab })
  }

  const handleGradientChange = (gradient: string) => {
    updateBackgroundState({
      selectedGradient: gradient,
      linearGradient: gradient,
    })
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

  const extractRGBValues = (gradient: string) => {
    const rgbRegex = /rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)/g
    return gradient.match(rgbRegex)
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
          <div className="flex mt-3">
            {extractRGBValues(backgroundState.selectedGradient)?.map(
              (color) => (
                <span
                  style={{
                    background: color,
                    height: '30px',
                    width: '30px',
                    margin: '4px',
                    borderRadius: '4px',
                    border: '1px solid gray',
                    position: 'relative',
                  }}
                  key={color}
                >
                  <span className="absolute -top-2 -right-1 bg-white dark:bg-[rgb(5,50,50)] flex justify-center items-center rounded-full p-1">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 24 24"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path fill="none" d="M0 0h24v24H0V0z" />
                      <path d="m17.66 5.41.92.92-2.69 2.69-.92-.92 2.69-2.69M17.67 3c-.26 0-.51.1-.71.29l-3.12 3.12-1.93-1.91-1.41 1.41 1.42 1.42L3 16.25V21h4.75l8.92-8.92 1.42 1.42 1.41-1.41-1.92-1.92 3.12-3.12c.4-.4.4-1.03.01-1.42l-2.34-2.34c-.2-.19-.45-.29-.7-.29zM6.92 19 5 17.08l8.06-8.06 1.92 1.92L6.92 19z" />
                    </svg>
                  </span>
                </span>
              )
            )}
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
    </div>
  )
}
