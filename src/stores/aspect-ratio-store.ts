import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  AspectRatio,
  AspectRatioState,
  DEFAULT_ASPECT_RATIO_STATE,
} from '@/types/thumbnail'

interface AspectRatioStore {
  // State
  currentRatio: AspectRatio
  isMenuOpen: boolean
  containerScale: number
  containerDimensions: AspectRatioState['containerDimensions']

  // Actions
  setCurrentRatio: (ratio: AspectRatio) => void
  setContainerScale: (scale: number) => void
  toggleMenu: () => void
  closeMenu: () => void
  openMenu: () => void
  updateContainerDimensions: (
    dimensions: Partial<AspectRatioState['containerDimensions']>
  ) => void
  reset: () => void
}

export const useAspectRatioStore = create<AspectRatioStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentRatio: DEFAULT_ASPECT_RATIO_STATE.currentRatio,
      isMenuOpen: DEFAULT_ASPECT_RATIO_STATE.isMenuOpen,
      containerScale: DEFAULT_ASPECT_RATIO_STATE.containerScale,
      containerDimensions: DEFAULT_ASPECT_RATIO_STATE.containerDimensions,

      // Actions
      setCurrentRatio: (ratio: AspectRatio) => {
        const state = get()
        const { maxWidth, maxHeight } = state.containerDimensions
        const scale = state.containerScale

        let newWidth, newHeight

        // Calculate base dimensions while respecting max constraints
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

        // Apply scale to final dimensions
        newWidth *= scale
        newHeight *= scale

        set({
          currentRatio: ratio,
          isMenuOpen: false, // Close menu after selection
          containerDimensions: {
            ...state.containerDimensions,
            width: Math.round(newWidth),
            height: Math.round(newHeight),
          },
        })
      },

      setContainerScale: (scale: number) => {
        const state = get()
        const { currentRatio } = state

        // Recalculate dimensions with new scale
        const { maxWidth, maxHeight } = state.containerDimensions

        let newWidth, newHeight

        // Calculate base dimensions while respecting max constraints
        if (currentRatio.ratio >= 1) {
          // Landscape or square - constrain by max width first
          newWidth = Math.min(maxWidth, currentRatio.width)
          newHeight = newWidth / currentRatio.ratio

          // If height exceeds max, recalculate based on height
          if (newHeight > maxHeight) {
            newHeight = maxHeight
            newWidth = newHeight * currentRatio.ratio
          }
        } else {
          // Portrait - constrain by max height first
          newHeight = Math.min(maxHeight, currentRatio.height)
          newWidth = newHeight * currentRatio.ratio

          // If width exceeds max, recalculate based on width
          if (newWidth > maxWidth) {
            newWidth = maxWidth
            newHeight = newWidth / currentRatio.ratio
          }
        }

        // Apply new scale to final dimensions
        newWidth *= scale
        newHeight *= scale

        set({
          containerScale: scale,
          containerDimensions: {
            ...state.containerDimensions,
            width: Math.round(newWidth),
            height: Math.round(newHeight),
          },
        })
      },

      toggleMenu: () => {
        set((state) => ({
          isMenuOpen: !state.isMenuOpen,
        }))
      },

      closeMenu: () => {
        set({ isMenuOpen: false })
      },

      openMenu: () => {
        set({ isMenuOpen: true })
      },

      updateContainerDimensions: (dimensions) => {
        set((state) => ({
          containerDimensions: {
            ...state.containerDimensions,
            ...dimensions,
          },
        }))
      },

      reset: () => {
        set({
          currentRatio: DEFAULT_ASPECT_RATIO_STATE.currentRatio,
          isMenuOpen: DEFAULT_ASPECT_RATIO_STATE.isMenuOpen,
          containerScale: DEFAULT_ASPECT_RATIO_STATE.containerScale,
          containerDimensions: DEFAULT_ASPECT_RATIO_STATE.containerDimensions,
        })
      },
    }),
    {
      name: 'aspect-ratio-store', // Store key in localStorage
      partialize: (state) => ({
        currentRatio: state.currentRatio,
        containerScale: state.containerScale,
        containerDimensions: state.containerDimensions,
        // Don't persist menu open state
      }),
    }
  )
)
