import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { EditorSidebarProps } from '@/types/thumbnail'
import { EditorSidebar } from '../editor/EditorSidebar'

export function EditorCard(props: EditorSidebarProps) {
  const { editorState, updateEditorState } = props

  const toggleSidebar = () => {
    updateEditorState({ sidebarCollapsed: !editorState.sidebarCollapsed })
  }

  return (
    <div
      className={cn(
        'transition-all duration-300 ease-in-out order-1 xl:order-2 h-full',
        editorState.sidebarCollapsed
          ? 'w-16'
          : 'w-full xl:w-[30%] xl:max-w-[400px]'
      )}
    >
      <Card className="h-full backdrop-blur-sm bg-white/70 dark:bg-slate-800/70 border-slate-200/50 dark:border-slate-700/50 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50">
        <CardContent className="p-0 h-full relative">
          {/* Collapse/Expand Toggle */}
          <button
            onClick={toggleSidebar}
            className="absolute -left-3 top-6 z-10 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          >
            <svg
              className={cn(
                'w-3 h-3 text-slate-600 dark:text-slate-400 transition-transform duration-200',
                editorState.sidebarCollapsed ? 'rotate-180' : ''
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {!editorState.sidebarCollapsed && <EditorSidebar {...props} />}

          {editorState.sidebarCollapsed && (
            <div className="p-4 flex flex-col items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM15 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4z" />
                </svg>
              </div>
              <div className="text-xs text-center text-slate-600 dark:text-slate-400 rotate-90 whitespace-nowrap">
                Editor
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
