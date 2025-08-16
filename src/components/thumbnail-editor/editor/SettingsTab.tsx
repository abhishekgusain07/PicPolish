import { useConfirm } from '../../../../hooks/use-confirm'
import { FilterControls } from '../controls/FilterControls'
import {
  ImageFilters,
  EditorState,
  ExportSettings,
  PlatformConfig,
  ExportQuality,
  ExportFormat,
} from '@/types/thumbnail'

interface SettingsTabProps {
  filters: ImageFilters
  updateFilters: (updates: Partial<ImageFilters>) => void
  editorState: EditorState
  updateEditorState: (updates: Partial<EditorState>) => void
  exportSettings: ExportSettings
  updateExportSettings: (updates: Partial<ExportSettings>) => void
  onReset: () => void
  config: PlatformConfig
}

export function SettingsTab({
  filters,
  updateFilters,
  editorState,
  updateEditorState,
  exportSettings,
  updateExportSettings,
  onReset,
  config,
}: SettingsTabProps) {
  const [ResetDialog, confirm] = useConfirm(
    'Reset',
    'Are you sure you want to reset? Changes are irreversible.'
  )

  const handleReset = async () => {
    const ok = await confirm()
    if (ok) {
      onReset()
    }
  }

  return (
    <div className="p-4 space-y-6">
      <ResetDialog />

      {/* Quality and Format Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Quality
          </label>
          <select
            value={exportSettings.quality}
            onChange={(e) =>
              updateExportSettings({ quality: e.target.value as ExportQuality })
            }
            className="w-full px-3 py-2 rounded-xl bg-slate-50/80 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
          >
            <option value="1">1x</option>
            <option value="2">2x</option>
            <option value="4">4x</option>
            <option value="6">6x</option>
            <option value="8">8x</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Format
          </label>
          <select
            value={exportSettings.format}
            onChange={(e) =>
              updateExportSettings({ format: e.target.value as ExportFormat })
            }
            className="w-full px-3 py-2 rounded-xl bg-slate-50/80 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
          >
            {config.supportedFormats.map((format) => (
              <option key={format} value={format}>
                {format.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
          Filters
        </h3>
        <FilterControls filters={filters} updateFilters={updateFilters} />
      </div>

      {/* Export Settings */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
          Export Settings
        </h3>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <svg
              className="size-4"
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 384 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zM332.1 128H256V51.9l76.1 76.1zM48 464V48h160v104c0 13.3 10.7 24 24 24h104v288H48z" />
            </svg>
            File Name
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 rounded-xl bg-slate-50/80 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
            value={editorState.fileName}
            onChange={(e) => updateEditorState({ fileName: e.target.value })}
            placeholder="Enter filename..."
          />
        </div>
      </div>

      {/* Reset Button */}
      <button
        className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-medium bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
        type="button"
        onClick={handleReset}
      >
        <svg
          className="size-4"
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="none" d="M0 0h24v24H0V0z" />
          <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
        </svg>
        Reset All Settings
      </button>
    </div>
  )
}
