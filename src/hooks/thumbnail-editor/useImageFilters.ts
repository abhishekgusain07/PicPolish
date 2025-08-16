import { useCallback } from 'react'
import { ImageFilters } from '@/types/thumbnail'

interface UseImageFiltersProps {
  filters: ImageFilters
  updateFilters: (updates: Partial<ImageFilters>) => void
}

export function useImageFilters({
  filters,
  updateFilters,
}: UseImageFiltersProps) {
  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      updateFilters({ [name]: parseFloat(value) })
    },
    [updateFilters]
  )

  const setSpecificFilter = useCallback(
    (filterName: keyof ImageFilters, value: number) => {
      updateFilters({ [filterName]: value })
    },
    [updateFilters]
  )

  const getFilterStyle = useCallback(() => {
    return `brightness(${filters.brightness}) contrast(${filters.contrast}) grayscale(${filters.grayscale}) blur(${filters.blur}px) hue-rotate(${filters.hueRotate}deg) invert(${filters.invert}) opacity(${filters.opacity}) saturate(${filters.saturate}) sepia(${filters.sepia})`
  }, [filters])

  const resetFilters = useCallback(() => {
    updateFilters({
      brightness: 1,
      contrast: 1,
      grayscale: 0,
      blur: 0,
      hueRotate: 0,
      invert: 0,
      opacity: 1,
      saturate: 1,
      sepia: 0,
    })
  }, [updateFilters])

  return {
    filters,
    handleFilterChange,
    setSpecificFilter,
    getFilterStyle,
    resetFilters,
  }
}
