import { useReducer, useCallback } from 'react'
import {
  EditorState,
  BackgroundState,
  WatermarkState,
  ImageState,
  ImageFilters,
  ExportSettings,
  EditorAction,
  DEFAULT_EDITOR_STATE,
  DEFAULT_WATERMARK_STATE,
  DEFAULT_IMAGE_STATE,
  DEFAULT_FILTERS,
  DEFAULT_EXPORT_SETTINGS,
  PlatformConfig,
} from '@/types/thumbnail'
import { Gradients } from '@/constants/gradient'
import { PlainColors } from '@/constants/plainColors'
import { extractHexColorsWithValidation } from '@/lib/color-utils'

interface EditorStateContext {
  editorState: EditorState
  backgroundState: BackgroundState
  watermarkState: WatermarkState
  imageState: ImageState
  filters: ImageFilters
  exportSettings: ExportSettings
}

const createInitialBackgroundState = (): BackgroundState => {
  const defaultGradient =
    'linear-gradient(135deg, rgb(255, 0, 44), rgb(255, 0, 130), rgb(255, 0, 216))'

  // Use validation function to ensure we always have valid colors
  const extractedColors = extractHexColorsWithValidation(defaultGradient)
  console.log('Initial gradient colors extracted:', extractedColors)

  return {
    subActiveTab: 'Gradient',
    linearGradient: defaultGradient,
    backgroundImage: 1,
    solidColor: PlainColors[0],
    selectedGradient: Gradients[0],
    selectedSolidColor: PlainColors[0],
    selectedImage: 1,
    gradientColors: extractedColors,
  }
}

const createInitialState = (config: PlatformConfig): EditorStateContext => ({
  editorState: {
    ...DEFAULT_EDITOR_STATE,
    fileName: config.defaultFileName,
  },
  backgroundState: createInitialBackgroundState(),
  watermarkState: {
    ...DEFAULT_WATERMARK_STATE,
    watermarkText: config.watermarkText,
  },
  imageState: DEFAULT_IMAGE_STATE,
  filters: DEFAULT_FILTERS,
  exportSettings: {
    ...DEFAULT_EXPORT_SETTINGS,
    format: config.defaultFormat,
  },
})

function editorReducer(
  state: EditorStateContext,
  action: EditorAction
): EditorStateContext {
  switch (action.type) {
    case 'UPDATE_EDITOR':
      return {
        ...state,
        editorState: { ...state.editorState, ...action.payload },
      }

    case 'UPDATE_BACKGROUND':
      return {
        ...state,
        backgroundState: { ...state.backgroundState, ...action.payload },
      }

    case 'UPDATE_WATERMARK':
      return {
        ...state,
        watermarkState: { ...state.watermarkState, ...action.payload },
      }

    case 'UPDATE_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      }

    case 'UPDATE_EXPORT':
      return {
        ...state,
        exportSettings: { ...state.exportSettings, ...action.payload },
      }

    case 'UPDATE_IMAGE':
      return {
        ...state,
        imageState: { ...state.imageState, ...action.payload },
      }

    case 'RESET_ALL':
      return createInitialState(
        (action.payload as { config: PlatformConfig }).config
      )

    default:
      return state
  }
}

export function useEditorState(config: PlatformConfig) {
  const [state, dispatch] = useReducer(
    editorReducer,
    config,
    createInitialState
  )

  const updateEditorState = useCallback((updates: Partial<EditorState>) => {
    dispatch({ type: 'UPDATE_EDITOR', payload: updates })
  }, [])

  const updateBackgroundState = useCallback(
    (updates: Partial<BackgroundState>) => {
      dispatch({ type: 'UPDATE_BACKGROUND', payload: updates })
    },
    []
  )

  const updateWatermarkState = useCallback(
    (updates: Partial<WatermarkState>) => {
      dispatch({ type: 'UPDATE_WATERMARK', payload: updates })
    },
    []
  )

  const updateFilters = useCallback((updates: Partial<ImageFilters>) => {
    dispatch({ type: 'UPDATE_FILTERS', payload: updates })
  }, [])

  const updateExportSettings = useCallback(
    (updates: Partial<ExportSettings>) => {
      dispatch({ type: 'UPDATE_EXPORT', payload: updates })
    },
    []
  )

  const updateImageState = useCallback((updates: Partial<ImageState>) => {
    dispatch({ type: 'UPDATE_IMAGE', payload: updates })
  }, [])

  const resetAll = useCallback(() => {
    dispatch({ type: 'RESET_ALL', payload: { config } })
  }, [config])

  return {
    ...state,
    updateEditorState,
    updateBackgroundState,
    updateWatermarkState,
    updateFilters,
    updateExportSettings,
    updateImageState,
    resetAll,
  }
}
