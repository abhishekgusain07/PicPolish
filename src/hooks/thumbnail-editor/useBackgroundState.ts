import { useCallback } from 'react'
import { BackgroundState, SubActiveTab } from '@/types/thumbnail'

interface UseBackgroundStateProps {
  backgroundState: BackgroundState
  updateBackgroundState: (updates: Partial<BackgroundState>) => void
}

export function useBackgroundState({
  backgroundState,
  updateBackgroundState,
}: UseBackgroundStateProps) {
  const handleSubActiveTabChange = useCallback(
    (tab: SubActiveTab) => {
      updateBackgroundState({ subActiveTab: tab })
    },
    [updateBackgroundState]
  )

  const handleGradientChange = useCallback(
    (gradient: string) => {
      updateBackgroundState({
        selectedGradient: gradient,
        linearGradient: gradient,
      })
    },
    [updateBackgroundState]
  )

  const handleSolidColorChange = useCallback(
    (color: string) => {
      updateBackgroundState({
        selectedSolidColor: color,
        solidColor: color,
      })
    },
    [updateBackgroundState]
  )

  const handleImageChange = useCallback(
    (imageNumber: number) => {
      updateBackgroundState({
        backgroundImage: imageNumber,
        selectedImage: imageNumber,
      })
    },
    [updateBackgroundState]
  )

  const getBackgroundStyle = useCallback(() => {
    const { subActiveTab, linearGradient, solidColor, backgroundImage } =
      backgroundState

    switch (subActiveTab) {
      case 'Gradient':
        return linearGradient
      case 'Solid':
        return solidColor
      case 'Image':
        return `url(/test${backgroundImage}.webp)`
      default:
        return linearGradient
    }
  }, [backgroundState])

  const extractRGBValues = useCallback((gradient: string) => {
    const rgbRegex = /rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)/g
    return gradient.match(rgbRegex)
  }, [])

  return {
    backgroundState,
    handleSubActiveTabChange,
    handleGradientChange,
    handleSolidColorChange,
    handleImageChange,
    getBackgroundStyle,
    extractRGBValues,
  }
}
