import { FilterControlsProps } from '@/types/thumbnail'

const filterConfig = [
  { name: 'brightness', label: 'Brightness', min: 0, max: 2, step: 0.1 },
  { name: 'contrast', label: 'Contrast', min: 0, max: 2, step: 0.1 },
  { name: 'grayscale', label: 'Grayscale', min: 0, max: 1, step: 0.1 },
  { name: 'blur', label: 'Blur', min: 0, max: 10, step: 0.5, unit: 'px' },
  {
    name: 'hueRotate',
    label: 'Hue Rotate',
    min: 0,
    max: 360,
    step: 10,
    unit: '°',
  },
  { name: 'invert', label: 'Invert', min: 0, max: 1, step: 0.1 },
  { name: 'opacity', label: 'Opacity', min: 0, max: 1, step: 0.1 },
  { name: 'saturate', label: 'Saturate', min: 0, max: 2, step: 0.1 },
  { name: 'sepia', label: 'Sepia', min: 0, max: 1, step: 0.1 },
] as const

export function FilterControls({
  filters,
  updateFilters,
}: FilterControlsProps) {
  const handleFilterChange = (
    filterName: keyof typeof filters,
    value: number
  ) => {
    updateFilters({ [filterName]: value })
  }

  return (
    <div className="space-y-3">
      {filterConfig.map(({ name, label, min, max, step, unit }) => (
        <div key={name} className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400 min-w-0 flex-1">
            {label}
          </label>
          <div className="flex items-center gap-3 flex-1 max-w-[200px]">
            <input
              className="flex-1 h-2 rounded-full appearance-none bg-slate-200 dark:bg-slate-600 outline-none slider-thumb"
              type="range"
              min={min}
              max={max}
              step={step}
              value={filters[name]}
              onChange={(e) =>
                handleFilterChange(name, parseFloat(e.target.value))
              }
            />
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 w-8 text-right">
              {filters[name]}
              {unit || ''}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
