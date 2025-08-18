'use client'
import { motion } from 'motion/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { PolaroidState, PolaroidConfig } from '@/types/thumbnail'
import { PolaroidCanvas } from './PolaroidCanvas'

interface PolaroidEditorProps {
  state: PolaroidState
  setState: React.Dispatch<React.SetStateAction<PolaroidState>>
  config: PolaroidConfig
  onBack: () => void
  onNext: () => void
}

export function PolaroidEditor({
  state,
  setState,
  config,
  onBack,
  onNext,
}: PolaroidEditorProps) {
  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <motion.button
          onClick={onBack}
          className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors flex items-center gap-2"
          whileHover={{ x: -4 }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to styles
        </motion.button>

        <motion.button
          onClick={onNext}
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
          whileHover={{ x: 4 }}
        >
          Preview
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          Customize Your Polaroid
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Style: {config.styles[state.style].name}
        </p>
      </motion.div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview Area */}
        <div className="flex items-center justify-center">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl p-8">
            <PolaroidCanvas
              state={state}
              config={config}
              width={350}
              height={350}
              scale={1}
            />
          </div>
        </div>

        {/* Controls Area */}
        <div className="space-y-6">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl p-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
              Customization Options
            </h3>

            <div className="space-y-4">
              {config.styles[state.style].hasTextArea && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Custom Text
                  </label>
                  <textarea
                    value={state.textOverlay.text}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        textOverlay: {
                          ...prev.textOverlay,
                          text: e.target.value,
                        },
                      }))
                    }
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                    rows={3}
                    placeholder="Enter your custom text..."
                  />
                </div>
              )}

              {config.styles[state.style].hasTextArea && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Date
                  </label>
                  <input
                    type="text"
                    value={state.textOverlay.date}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        textOverlay: {
                          ...prev.textOverlay,
                          date: e.target.value,
                        },
                      }))
                    }
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                    placeholder="MM.DD.YYYY"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Frame Color
                </label>
                <div className="flex gap-2">
                  {['#ffffff', '#f5f5dc', '#f4e4bc', '#e6ddd4'].map((color) => (
                    <button
                      key={color}
                      onClick={() =>
                        setState((prev) => ({
                          ...prev,
                          customizations: {
                            ...prev.customizations,
                            frameColor: color,
                          },
                        }))
                      }
                      className={`w-8 h-8 rounded-full border-2 ${
                        state.customizations.frameColor === color
                          ? 'border-amber-500'
                          : 'border-slate-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {state.style !== 'filmstrip' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Decorative Element
                  </label>
                  <div className="flex gap-2">
                    {['heart', 'star', 'flower', 'none'].map((element) => (
                      <button
                        key={element}
                        onClick={() =>
                          setState((prev) => ({
                            ...prev,
                            customizations: {
                              ...prev.customizations,
                              decorativeElement: element,
                            },
                          }))
                        }
                        className={`px-3 py-2 rounded-lg border text-sm ${
                          state.customizations.decorativeElement === element
                            ? 'border-amber-500 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300'
                            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {element === 'heart' && '♡'}
                        {element === 'star' && '✦'}
                        {element === 'flower' && '❀'}
                        {element === 'none' && 'None'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {state.style === 'vintage' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Aging Effect ({state.customizations.agingEffect}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={state.customizations.agingEffect}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        customizations: {
                          ...prev.customizations,
                          agingEffect: parseInt(e.target.value),
                        },
                      }))
                    }
                    className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>Clean</span>
                    <span>Aged</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
