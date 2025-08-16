import { cn } from '@/lib/utils'
import { EditorSidebarProps } from '@/types/thumbnail'
import { SettingsTab } from './SettingsTab'
import { EditTab } from './EditTab'
import { BackgroundTab } from './BackgroundTab'

export function EditorSidebar({
  activeTab,
  setActiveTab,
  editorState,
  updateEditorState,
  backgroundState,
  updateBackgroundState,
  watermarkState,
  updateWatermarkState,
  filters,
  updateFilters,
  exportSettings,
  updateExportSettings,
  onReset,
  config,
}: EditorSidebarProps) {
  return (
    <div className="w-full h-full p-4 overflow-auto scrollbar-none">
      {/* Tab Navigation */}
      <div className="w-full flex flex-row items-center justify-between rounded-2xl p-3 text-sm font-semibold bg-slate-50/80 dark:bg-slate-700/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 mb-4">
        <button
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-200 font-medium text-sm',
            activeTab === 'Settings'
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-200/50 dark:shadow-blue-900/50'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-600/50 hover:text-slate-800 dark:hover:text-slate-200'
          )}
          onClick={() => setActiveTab('Settings')}
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
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
          </svg>
          Settings
        </button>
        <button
          className={cn(
            'px-4 py-2.5 rounded-full transition-all duration-200 font-medium text-sm',
            activeTab === 'Edit'
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-200/50 dark:shadow-blue-900/50'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-600/50 hover:text-slate-800 dark:hover:text-slate-200'
          )}
          onClick={() => setActiveTab('Edit')}
        >
          Edit
        </button>
        <button
          className={cn(
            'px-4 py-2.5 rounded-full transition-all duration-200 font-medium text-sm',
            activeTab === 'Background'
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-200/50 dark:shadow-blue-900/50'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-600/50 hover:text-slate-800 dark:hover:text-slate-200'
          )}
          onClick={() => setActiveTab('Background')}
        >
          Background
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'Settings' && (
        <SettingsTab
          filters={filters}
          updateFilters={updateFilters}
          editorState={editorState}
          updateEditorState={updateEditorState}
          exportSettings={exportSettings}
          updateExportSettings={updateExportSettings}
          onReset={onReset}
          config={config}
        />
      )}

      {activeTab === 'Edit' && (
        <EditTab
          editorState={editorState}
          updateEditorState={updateEditorState}
        />
      )}

      {activeTab === 'Background' && (
        <BackgroundTab
          backgroundState={backgroundState}
          updateBackgroundState={updateBackgroundState}
        />
      )}

      {/* Watermark Toggle */}
      <div className="p-4 border-t border-slate-200/50 dark:border-slate-600/50">
        <label className="inline-flex items-center gap-3 cursor-pointer">
          <input
            id="showWatermark"
            type="checkbox"
            className="sr-only peer"
            checked={watermarkState.showWatermark}
            onChange={(e) =>
              updateWatermarkState({ showWatermark: e.target.checked })
            }
          />
          <div className="relative w-10 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 shadow-inner" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Show Watermark
          </span>
        </label>
      </div>

      {/* Pro Upgrade */}
      <div className="p-4 border-t border-slate-200/50 dark:border-slate-600/50 space-y-3">
        <a
          className="block w-full p-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          href="/pricing"
        >
          <div className="flex items-center justify-center gap-2 text-white font-semibold">
            <span className="text-2xl">👑</span>
            <span>Upgrade to Pro</span>
          </div>
        </a>
        <p className="text-xs text-center text-slate-600 dark:text-slate-400">
          Get <span className="font-semibold text-orange-500">50% off</span> on{' '}
          <span className="font-semibold">Lifetime</span> deal, use code{' '}
          <span className="font-semibold font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-orange-500">
            NEW50
          </span>
        </p>
      </div>
    </div>
  )
}
