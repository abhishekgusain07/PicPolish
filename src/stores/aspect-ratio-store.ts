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
  containerDimensions: AspectRatioState['containerDimensions']

  // Actions
  setCurrentRatio: (ratio: AspectRatio) => void
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
      containerDimensions: DEFAULT_ASPECT_RATIO_STATE.containerDimensions,

      // Actions
      setCurrentRatio: (ratio: AspectRatio) => {
        const state = get()
        const { maxWidth, maxHeight } = state.containerDimensions

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
          containerDimensions: DEFAULT_ASPECT_RATIO_STATE.containerDimensions,
        })
      },
    }),
    {
      name: 'aspect-ratio-store', // Store key in localStorage
      partialize: (state) => ({
        currentRatio: state.currentRatio,
        containerDimensions: state.containerDimensions,
        // Don't persist menu open state
      }),
    }
  )
)
