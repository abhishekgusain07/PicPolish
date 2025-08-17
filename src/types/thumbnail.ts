export type ActiveTab = 'Settings' | 'Edit' | 'Background'
export type SubActiveTab = 'Gradient' | 'Image' | 'Solid' | 'Overlay'
export type WatermarkStyle = 'dark' | 'light' | 'glassy'
export type ExportFormat = 'png' | 'jpeg' | 'svg' | 'webp'
export type ExportQuality = '1' | '2' | '4' | '6' | '8'
export type AspectRatioName =
  | 'auto'
  | 'square'
  | '16:9'
  | '9:16'
  | '4:3'
  | '3:4'
  | '3:2'
  | '2:3'
  | '3:1'
  | '1:3'
  | '5:4'
  | '4:5'
  | '21:9'
  | '9:21'
  | '1.91:1'
  | '1:1.91'
  | '2:1'
  | '1:2'
  | '18.5:9'
  | '9:18.5'
  | '19.5:9'
  | '9:19.5'
  | '18:9'
  | '5.3:4'
  | '4:5.3'
  | 'custom'

export interface AspectRatio {
  name: AspectRatioName
  label: string
  ratio: number
  width: number
  height: number
}

export interface AspectRatioState {
  currentRatio: AspectRatio
  isMenuOpen: boolean
  containerDimensions: {
    width: number
    height: number
    maxWidth: number
    maxHeight: number
  }
}

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
  selectedOverlay: string | null
  overlayOpacity: number
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
  tweetData?: Record<string, unknown>
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

export interface OverlaySelectorProps {
  selectedOverlay: string | null
  overlayOpacity: number
  onOverlayChange: (overlay: string | null) => void
  onOpacityChange: (opacity: number) => void
}

export interface OverlayLayerProps {
  selectedOverlay: string | null
  overlayOpacity: number
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

export const ASPECT_RATIOS: AspectRatio[] = [
  { name: 'auto', label: 'Auto', ratio: 1, width: 400, height: 400 },
  {
    name: 'square',
    label: '1:1 Instagram Post (Square)',
    ratio: 1,
    width: 400,
    height: 400,
  },
  {
    name: '3:1',
    label: '3:1 Twitter Header',
    ratio: 3,
    width: 600,
    height: 200,
  },
  {
    name: '4:3',
    label: '4:3 Standard TV',
    ratio: 4 / 3,
    width: 480,
    height: 360,
  },
  {
    name: '3:4',
    label: '3:4 Portrait TV',
    ratio: 3 / 4,
    width: 360,
    height: 480,
  },
  {
    name: '5:4',
    label: '5:4 Classic Computer Monitor',
    ratio: 5 / 4,
    width: 500,
    height: 400,
  },
  {
    name: '4:5',
    label: '4:5 Instagram Portrait',
    ratio: 4 / 5,
    width: 320,
    height: 400,
  },
  {
    name: '16:9',
    label: '16:9 Youtube Video',
    ratio: 16 / 9,
    width: 640,
    height: 360,
  },
  {
    name: '9:16',
    label: '9:16 Instagram Story',
    ratio: 9 / 16,
    width: 360,
    height: 640,
  },
  {
    name: '21:9',
    label: '21:9 Ultrawide Monitor',
    ratio: 21 / 9,
    width: 700,
    height: 300,
  },
  {
    name: '9:21',
    label: '9:21 Ultrawide Portrait',
    ratio: 9 / 21,
    width: 300,
    height: 700,
  },
  {
    name: '3:2',
    label: '3:2 Classic Film Camera',
    ratio: 3 / 2,
    width: 540,
    height: 360,
  },
  {
    name: '2:3',
    label: '2:3 Portrait Film Camera',
    ratio: 2 / 3,
    width: 360,
    height: 540,
  },
  {
    name: '2:1',
    label: '2:1 Panoramic Landscape',
    ratio: 2,
    width: 600,
    height: 300,
  },
  {
    name: '1:2',
    label: '1:2 Panoramic Portrait',
    ratio: 1 / 2,
    width: 300,
    height: 600,
  },
  {
    name: '1.91:1',
    label: '1.91:1 Facebook Link Preview',
    ratio: 1.91,
    width: 573,
    height: 300,
  },
  {
    name: '1:1.91',
    label: '1:1.91 Facebook Link Preview (Portrait)',
    ratio: 1 / 1.91,
    width: 300,
    height: 573,
  },
  {
    name: '5.3:4',
    label: '5.3:4 iPhone Photo (Portrait)',
    ratio: 5.3 / 4,
    width: 400,
    height: 302,
  },
  {
    name: '4:5.3',
    label: '4:5.3 iPhone Photo',
    ratio: 4 / 5.3,
    width: 302,
    height: 400,
  },
  {
    name: '18.5:9',
    label: '18.5:9 Samsung Galaxy S8/S9',
    ratio: 18.5 / 9,
    width: 617,
    height: 300,
  },
  {
    name: '9:18.5',
    label: '9:18.5 Samsung Galaxy S8/S9 (Portrait)',
    ratio: 9 / 18.5,
    width: 300,
    height: 617,
  },
  {
    name: '19.5:9',
    label: '19.5:9 iPhone X/XS/XR',
    ratio: 19.5 / 9,
    width: 650,
    height: 300,
  },
  {
    name: '9:19.5',
    label: '9:19.5 iPhone X/XS/XR (Portrait)',
    ratio: 9 / 19.5,
    width: 300,
    height: 650,
  },
  {
    name: '18:9',
    label: '18:9 Google Pixel XL2/XL3',
    ratio: 18 / 9,
    width: 600,
    height: 300,
  },
]

export const DEFAULT_ASPECT_RATIO: AspectRatio = ASPECT_RATIOS[0] // Auto

export const DEFAULT_ASPECT_RATIO_STATE: AspectRatioState = {
  currentRatio: DEFAULT_ASPECT_RATIO,
  isMenuOpen: false,
  containerDimensions: {
    width: 400,
    height: 400,
    maxWidth: 800,
    maxHeight: 600,
  },
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
