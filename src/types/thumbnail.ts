export type ActiveTab = 'Settings' | 'Edit' | 'Background'
export type SubActiveTab = 'Gradient' | 'Image' | 'Solid'
export type WatermarkStyle = 'dark' | 'light' | 'glassy'
export type ExportFormat = 'png' | 'jpeg' | 'svg' | 'webp'
export type ExportQuality = '1' | '2' | '4' | '6' | '8'

export interface ImageFilters {
  brightness: number
  contrast: number
  grayscale: number
  blur: number
  hueRotate: number
  invert: number
  opacity: number
  saturate: number
  sepia: number
}

export interface EditorState {
  paddingValue: number
  imageScale: number
  imageBorder: number
  imageShadow: number
  imageTransform: string
  imagePosition: string
  fileName: string
  sidebarCollapsed: boolean
}

export interface BackgroundState {
  subActiveTab: SubActiveTab
  linearGradient: string
  backgroundImage: number
  solidColor: string
  selectedGradient: string
  selectedSolidColor: string
  selectedImage: number
  gradientColors: string[]
}

export interface ColorPickerState {
  isOpen: boolean
  colorIndex: number
  position: { x: number; y: number }
}

export interface WatermarkState {
  showWatermark: boolean
  watermarkStyle: WatermarkStyle
  watermarkText: string
  showWaterMarkOptions: boolean
}

export interface ImageState {
  url: string
  isLoading: boolean
  error: boolean
}

export interface ExportSettings {
  quality: ExportQuality
  format: ExportFormat
}

export interface PlatformConfig {
  name: string
  apiEndpoint: string
  placeholderText: string
  defaultFileName: string
  watermarkText: string
  supportedFormats: ExportFormat[]
  defaultFormat: ExportFormat
  maxImageSize?: {
    width: number
    height: number
  }
  inputLabel: string
  buttonText: string
  validationRules?: {
    urlPattern?: RegExp
    requiredDomain?: string
  }
}

export interface ThumbnailEditorProps {
  config: PlatformConfig
  onImageFetch?: (url: string) => Promise<{ thumbnails: { maxres: string } }>
  className?: string
}

export interface PreviewProps {
  editorState: EditorState
  backgroundState: BackgroundState
  watermarkState: WatermarkState
  imageState: ImageState
  filters: ImageFilters
  onImageFetch: (url: string) => Promise<void>
  onReset: () => void
  config: PlatformConfig
}

export interface EditorSidebarProps {
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void
  editorState: EditorState
  updateEditorState: (updates: Partial<EditorState>) => void
  backgroundState: BackgroundState
  updateBackgroundState: (updates: Partial<BackgroundState>) => void
  watermarkState: WatermarkState
  updateWatermarkState: (updates: Partial<WatermarkState>) => void
  filters: ImageFilters
  updateFilters: (updates: Partial<ImageFilters>) => void
  exportSettings: ExportSettings
  updateExportSettings: (updates: Partial<ExportSettings>) => void
  onReset: () => void
  config: PlatformConfig
}

export interface FilterControlsProps {
  filters: ImageFilters
  updateFilters: (updates: Partial<ImageFilters>) => void
}

export interface TransformControlsProps {
  imageTransform: string
  setImageTransform: (transform: string) => void
  imagePosition: string
  setImagePosition: (position: string) => void
  paddingValue: number
  setPaddingValue: (value: number) => void
  imageScale: number
  setImageScale: (scale: number) => void
  imageBorder: number
  setImageBorder: (border: number) => void
  imageShadow: number
  setImageShadow: (shadow: number) => void
}

export interface BackgroundSelectorProps {
  backgroundState: BackgroundState
  updateBackgroundState: (updates: Partial<BackgroundState>) => void
}

export interface ApiResponse {
  thumbnails: {
    maxres: string
  }
}

export interface EditorAction {
  type:
    | 'UPDATE_EDITOR'
    | 'UPDATE_BACKGROUND'
    | 'UPDATE_WATERMARK'
    | 'UPDATE_FILTERS'
    | 'UPDATE_EXPORT'
    | 'UPDATE_IMAGE'
    | 'RESET_ALL'
  payload?: Record<string, unknown>
}

export const DEFAULT_FILTERS: ImageFilters = {
  brightness: 1,
  contrast: 1,
  grayscale: 0,
  blur: 0,
  hueRotate: 0,
  invert: 0,
  opacity: 1,
  saturate: 1,
  sepia: 0,
}

export const DEFAULT_EDITOR_STATE: EditorState = {
  paddingValue: 3,
  imageScale: 1,
  imageBorder: 1,
  imageShadow: 18,
  imageTransform: 'perspective(500px) rotateY(0deg) rotateX(0deg)',
  imagePosition: '1 1 1 1',
  fileName: 'thumbnail_editor_image',
  sidebarCollapsed: false,
}

export const DEFAULT_WATERMARK_STATE: WatermarkState = {
  showWatermark: true,
  watermarkStyle: 'dark',
  watermarkText: 'ThumbnailEditor',
  showWaterMarkOptions: false,
}

export const DEFAULT_IMAGE_STATE: ImageState = {
  url: '',
  isLoading: true,
  error: false,
}

export const DEFAULT_EXPORT_SETTINGS: ExportSettings = {
  quality: '2',
  format: 'png',
}

// Screenshot Tool Types
export type ScreenshotMode = 'select' | 'preview' | 'editing'
export type ImageSource = 'upload' | 'capture' | null
export type CaptureType = 'screen' | 'window' | 'tab'

export interface ScreenshotState {
  mode: ScreenshotMode
  imageSource: ImageSource
  imageBlob: Blob | null
  imageUrl: string | null
  filename: string
  originalFile?: File
}

export interface LocalImageConfig
  extends Omit<PlatformConfig, 'apiEndpoint' | 'validationRules'> {
  mode: 'local'
  supportedTypes: string[]
  maxFileSize: number
  allowMultiple: boolean
}

export interface CaptureOptions {
  type: CaptureType
  audio: boolean
  video: {
    mediaSource: string
    width?: { max: number }
    height?: { max: number }
  }
}

export interface ScreenshotToolProps {
  className?: string
}

export interface ImagePreviewProps {
  imageUrl: string
  filename: string
  fileSize?: number
  fileType?: string
  onEdit: () => void
  onRetake: () => void
}

export interface LocalImageEditorProps {
  imageUrl: string
  filename: string
  onBack: () => void
  config: LocalImageConfig
}

export const DEFAULT_SCREENSHOT_STATE: ScreenshotState = {
  mode: 'select',
  imageSource: null,
  imageBlob: null,
  imageUrl: null,
  filename: 'screenshot',
}

export const DEFAULT_LOCAL_CONFIG: LocalImageConfig = {
  name: 'Screenshot Editor',
  placeholderText: 'Drop your image here or click to upload',
  defaultFileName: 'screenshot_edited',
  watermarkText: 'ScreenshotTool',
  supportedFormats: ['png', 'jpeg', 'webp'],
  defaultFormat: 'png',
  inputLabel: 'Upload Image',
  buttonText: 'Start Editing',
  mode: 'local',
  supportedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowMultiple: false,
}
