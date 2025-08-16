import { TransformControls } from '../controls/TransformControls'
import { EditorState } from '@/types/thumbnail'

interface EditTabProps {
  editorState: EditorState
  updateEditorState: (updates: Partial<EditorState>) => void
}

export function EditTab({ editorState, updateEditorState }: EditTabProps) {
  return (
    <div className="p-4 space-y-6">
      {/* Appearance Controls */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
          Appearance
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-50/80 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 hover:bg-slate-100/80 dark:hover:bg-slate-600/50 transition-all duration-200">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Text Color
            </span>
            <span
              className="h-4 w-4 rounded-full border border-slate-300 dark:border-slate-500"
              style={{ backgroundColor: 'rgb(0, 0, 0)' }}
            />
          </button>
          <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-50/80 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 hover:bg-slate-100/80 dark:hover:bg-slate-600/50 transition-all duration-200">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Background
            </span>
            <span
              className="h-4 w-4 rounded-full border border-slate-300 dark:border-slate-500"
              style={{ backgroundColor: 'rgb(255, 255, 255)' }}
            />
          </button>
        </div>
      </div>

      {/* Transform Controls */}
      <TransformControls
        imageTransform={editorState.imageTransform}
        setImageTransform={(transform) =>
          updateEditorState({ imageTransform: transform })
        }
        imagePosition={editorState.imagePosition}
        setImagePosition={(position) =>
          updateEditorState({ imagePosition: position })
        }
        paddingValue={editorState.paddingValue}
        setPaddingValue={(value) => updateEditorState({ paddingValue: value })}
        imageScale={editorState.imageScale}
        setImageScale={(scale) => updateEditorState({ imageScale: scale })}
        imageBorder={editorState.imageBorder}
        setImageBorder={(border) => updateEditorState({ imageBorder: border })}
        imageShadow={editorState.imageShadow}
        setImageShadow={(shadow) => updateEditorState({ imageShadow: shadow })}
      />

      {/* Frame & Effects */}
      <div className="space-y-4">
        <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          Frame & Effects
        </h4>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Frame Style
            </label>
            <select
              name="frameStyle"
              className="w-full px-3 py-2 rounded-xl bg-slate-50/80 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
            >
              <option value="none">None</option>
              <option value="macOS-black">macOS Black</option>
              <option value="macOS-white">macOS White</option>
              <option value="photograph">Photograph</option>
              <option value="black">Black</option>
              <option value="white">White</option>
              <option value="dodgerblue">Blue</option>
              <option value="hotpink">Hotpink</option>
              <option value="green">Green</option>
              <option value="blueviolet">Blue Violet</option>
              <option value="gold">Gold</option>
            </select>
          </div>
          <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-50/80 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 hover:bg-slate-100/80 dark:hover:bg-slate-600/50 transition-all duration-200">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Shadow Color
            </span>
            <span
              className="h-4 w-4 rounded-full border border-slate-300 dark:border-slate-500"
              style={{ backgroundColor: 'rgb(30, 30, 30)' }}
            />
          </button>
        </div>
      </div>
    </div>
  )
}
