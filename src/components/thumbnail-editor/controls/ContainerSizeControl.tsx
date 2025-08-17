import { useAspectRatioStore } from '@/stores/aspect-ratio-store'

export function ContainerSizeControl() {
  const { containerScale, setContainerScale } = useAspectRatioStore()

  return (
    <div className="space-y-4">
      <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">
        Container Controls
      </h4>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 min-w-[100px]">
            Outer Box Size
          </label>
          <div className="flex items-center gap-3 flex-1 max-w-[200px]">
            <input
              className="flex-1 h-2 rounded-full appearance-none bg-slate-200 dark:bg-slate-600 outline-none slider-thumb"
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={containerScale}
              onChange={(e) => setContainerScale(Number(e.target.value))}
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 min-w-[50px] text-right">
              {Math.round(containerScale * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
