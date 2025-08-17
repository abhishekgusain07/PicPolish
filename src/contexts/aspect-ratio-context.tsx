'use client'
import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import {
  AspectRatio,
  AspectRatioState,
  DEFAULT_ASPECT_RATIO_STATE,
} from '@/types/thumbnail'

interface AspectRatioContextType {
  aspectRatioState: AspectRatioState
  setCurrentRatio: (ratio: AspectRatio) => void
  toggleMenu: () => void
  closeMenu: () => void
  openMenu: () => void
  updateContainerDimensions: (
    dimensions: Partial<AspectRatioState['containerDimensions']>
  ) => void
}

const AspectRatioContext = createContext<AspectRatioContextType | undefined>(
  undefined
)

interface AspectRatioProviderProps {
  children: ReactNode
  initialState?: Partial<AspectRatioState>
}

export function AspectRatioProvider({
  children,
  initialState,
}: AspectRatioProviderProps) {
  const [aspectRatioState, setAspectRatioState] = useState<AspectRatioState>({
    ...DEFAULT_ASPECT_RATIO_STATE,
    ...initialState,
  })

  const setCurrentRatio = useCallback((ratio: AspectRatio) => {
    setAspectRatioState((prev) => {
      // Calculate new container dimensions based on the aspect ratio
      const { maxWidth, maxHeight } = prev.containerDimensions

      let newWidth, newHeight

      // Calculate dimensions while respecting max constraints
      if (ratio.ratio >= 1) {
        // Landscape or square - constrain by max width first
        newWidth = Math.min(maxWidth, ratio.width)
        newHeight = newWidth / ratio.ratio

        // If height exceeds max, recalculate based on height
        if (newHeight > maxHeight) {
          newHeight = maxHeight
          newWidth = newHeight * ratio.ratio
        }
      } else {
        // Portrait - constrain by max height first
        newHeight = Math.min(maxHeight, ratio.height)
        newWidth = newHeight * ratio.ratio

        // If width exceeds max, recalculate based on width
        if (newWidth > maxWidth) {
          newWidth = maxWidth
          newHeight = newWidth / ratio.ratio
        }
      }

      return {
        ...prev,
        currentRatio: ratio,
        containerDimensions: {
          ...prev.containerDimensions,
          width: Math.round(newWidth),
          height: Math.round(newHeight),
        },
      }
    })
  }, [])

  const toggleMenu = useCallback(() => {
    setAspectRatioState((prev) => ({
      ...prev,
      isMenuOpen: !prev.isMenuOpen,
    }))
  }, [])

  const closeMenu = useCallback(() => {
    setAspectRatioState((prev) => ({
      ...prev,
      isMenuOpen: false,
    }))
  }, [])

  const openMenu = useCallback(() => {
    setAspectRatioState((prev) => ({
      ...prev,
      isMenuOpen: true,
    }))
  }, [])

  const updateContainerDimensions = useCallback(
    (dimensions: Partial<AspectRatioState['containerDimensions']>) => {
      setAspectRatioState((prev) => ({
        ...prev,
        containerDimensions: {
          ...prev.containerDimensions,
          ...dimensions,
        },
      }))
    },
    []
  )

  const value: AspectRatioContextType = {
    aspectRatioState,
    setCurrentRatio,
    toggleMenu,
    closeMenu,
    openMenu,
    updateContainerDimensions,
  }

  return (
    <AspectRatioContext.Provider value={value}>
      {children}
    </AspectRatioContext.Provider>
  )
}

export function useAspectRatio(): AspectRatioContextType {
  const context = useContext(AspectRatioContext)
  if (context === undefined) {
    throw new Error('useAspectRatio must be used within an AspectRatioProvider')
  }
  return context
}

export { AspectRatioContext }
