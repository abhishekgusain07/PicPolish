'use client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { Gradients } from '@/constants/gradient'
import { PlainColors } from '@/constants/plainColors'
import { Transform } from '@/constants/transform'
import { Position } from '@/constants/constant'
import { toast } from 'sonner'
import { useConfirm } from '../../../../hooks/use-confirm'
import { ArchiveRestoreIcon } from 'lucide-react'
import { Joystick } from 'react-joystick-component'

type ActiveTabs = 'Settings' | 'Edit' | 'Background'
type SubActiveTabs = 'Gradient' | 'Image' | 'Solid'
const initialTransform = 'perspective(500px) rotateY(0deg) rotateX(0deg)'
const initialPosition = '1 1 1 1'
const initialFileName = 'ToolsArsenal_2348239234'
const initialLinearGradient =
  'linear-gradient(135deg, rgb(255, 0, 44), rgb(255, 0, 87), rgb(255, 0, 130), rgb(255, 0, 173), rgb(255, 0, 216))'

const initialFilters: Partial<Filters> = {
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

interface Filters {
  brightness: number
  setBrightness: (value: number) => void
  contrast: number
  setContrast: (value: number) => void
  grayscale: number
  setGrayscale: (value: number) => void
  blur: number
  setBlur: (value: number) => void
  hueRotate: number
  setHueRotate: (value: number) => void
  invert: number
  setInvert: (value: number) => void
  opacity: number
  setOpacity: (value: number) => void
  saturate: number
  setSaturate: (value: number) => void
  sepia: number
  setSepia: (value: number) => void
}
interface ThumbnailComponentProps {
  paddingValue: number
  imageScale: number
  imageBorder: number
  imageShadow: number
  imageTransform: string
  imagePosition: string
  filters: Partial<Filters>
  linearGradient: string
  backgroundImage: number
  subActiveTab: SubActiveTabs
  solidColor: string
}

interface EditorSidebarProps {
  text?: string
  paddingValue: number
  setPaddingValue: (value: number) => void
  imageScale: number
  setImageScale: (value: number) => void
  imageBorder: number
  setImageBorder: (value: number) => void
  imageShadow: number
  setImageShadow: (value: number) => void
  imageTransform: string
  setImageTransform: (value: string) => void
  imagePosition: string
  setImagePosition: (value: string) => void
  filters: Filters
  setFilters: (value: Filters) => void
  fileName: string
  setFileName: (value: string) => void
  linearGradient: string
  setLinearGradient: (value: string) => void
  backgroundImage: number
  setBackgroundImage: (value: number) => void
  subActiveTab: SubActiveTabs
  setSubActiveTab: (value: SubActiveTabs) => void
  solidColor: string
  setSolidColor: (value: string) => void
}

export function YoutubeThumbnail() {
  const [paddingValue, setPaddingValue] = useState(3)
  const [imageScale, setImageScale] = useState(1)
  const [imageBorder, setImageBorder] = useState(1)
  const [imageShadow, setImageShadow] = useState(18)
  const [imageTransform, setImageTransform] = useState(initialTransform)
  const [imagePosition, setImagePosition] = useState(initialPosition)
  const [filters, setFilters] = useState(initialFilters)
  const [fileName, setFileName] = useState(initialFileName)
  const [linearGradient, setLinearGradient] = useState(initialLinearGradient)
  const [backgroundImage, setBackgroundImage] = useState(1)
  const [subActiveTab, setSubActiveTab] = useState<SubActiveTabs>('Gradient')
  const [solidColor, setSolidColor] = useState(PlainColors[0])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  return (
    <div
      id="maindiv"
      className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 lg:p-6 overflow-hidden"
    >
      <div className="flex flex-col xl:flex-row gap-4 lg:gap-6 max-w-7xl mx-auto h-full">
        {/* Preview Card */}
        <div className="flex-1 xl:w-[70%] order-2 xl:order-1 h-full">
          <Card className="h-full backdrop-blur-sm bg-white/70 dark:bg-slate-800/70 border-slate-200/50 dark:border-slate-700/50 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50">
            <CardContent className="p-0 h-full">
              <ThumbnailComponent
                paddingValue={paddingValue}
                imageScale={imageScale}
                imageBorder={imageBorder}
                imageShadow={imageShadow}
                imageTransform={imageTransform}
                imagePosition={imagePosition}
                filters={filters}
                linearGradient={linearGradient}
                backgroundImage={backgroundImage}
                subActiveTab={subActiveTab}
                solidColor={solidColor}
              />
            </CardContent>
          </Card>
        </div>

        {/* Editor Card */}
        <div
          className={cn(
            'transition-all duration-300 ease-in-out order-1 xl:order-2 h-full',
            sidebarCollapsed ? 'w-16' : 'w-full xl:w-[30%] xl:max-w-[400px]'
          )}
        >
          <Card className="h-full backdrop-blur-sm bg-white/70 dark:bg-slate-800/70 border-slate-200/50 dark:border-slate-700/50 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50">
            <CardContent className="p-0 h-full relative">
              {/* Collapse/Expand Toggle */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="absolute -left-3 top-6 z-10 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
              >
                <svg
                  className={cn(
                    'w-3 h-3 text-slate-600 dark:text-slate-400 transition-transform duration-200',
                    sidebarCollapsed ? 'rotate-180' : ''
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              {!sidebarCollapsed && (
                <EditorSidebar
                  text="Made By John 🔥"
                  paddingValue={paddingValue}
                  setPaddingValue={setPaddingValue}
                  imageScale={imageScale}
                  setImageScale={setImageScale}
                  imageBorder={imageBorder}
                  setImageBorder={setImageBorder}
                  imageShadow={imageShadow}
                  setImageShadow={setImageShadow}
                  imageTransform={imageTransform}
                  setImageTransform={setImageTransform}
                  imagePosition={imagePosition}
                  setImagePosition={setImagePosition}
                  filters={filters as Filters}
                  setFilters={setFilters}
                  fileName={fileName}
                  setFileName={setFileName}
                  linearGradient={linearGradient}
                  setLinearGradient={setLinearGradient}
                  backgroundImage={backgroundImage}
                  setBackgroundImage={setBackgroundImage}
                  subActiveTab={subActiveTab}
                  setSubActiveTab={setSubActiveTab}
                  solidColor={solidColor}
                  setSolidColor={setSolidColor}
                />
              )}
              {sidebarCollapsed && (
                <div className="p-4 flex flex-col items-center gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM15 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4z" />
                    </svg>
                  </div>
                  <div className="text-xs text-center text-slate-600 dark:text-slate-400 rotate-90 whitespace-nowrap">
                    Editor
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

const ThumbnailComponent = ({
  paddingValue,
  imageScale,
  imageBorder,
  imageShadow,
  imageTransform,
  imagePosition,
  filters,
  linearGradient,
  backgroundImage,
  subActiveTab,
  solidColor,
}: ThumbnailComponentProps) => {
  const [showWatermark, setShowWatermark] = useState(true)
  const [watermarkStyle, setWatermarkStyle] = useState('dark')
  const [watermarkText, setWatermarkText] = useState('ToolsArsenal')
  const [showWaterMarkOptions, setShowWaterMarkOptions] = useState(false)
  const [url, setUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true)
    e.preventDefault()
    try {
      const result = await fetch('/api/youtube', {
        method: 'POST',
        body: JSON.stringify({ videoUrl: url }),
      })
      const data = await result.json()
      console.log(result, 'result')
      setUrl(data.thumbnails.maxres)
    } catch (error) {
      setError(true)
    } finally {
      setIsLoading(false)
    }
  }
  const ResetState = () => {
    setUrl('')
    setIsLoading(true)
    setError(false)
  }
  const toggleWatermark = () => {
    setShowWaterMarkOptions((prev) => !prev)
  }
  if (error) {
    toast.error('Error fetching thumbnail')
    ResetState()
  }
  // const paddingOuter = Position2[imagePosition as keyof typeof Position2](paddingValue)
  return (
    <div className="flex flex-col items-center justify-center p-6 w-full h-full min-h-[600px]">
      <div
        id="ss"
        className="rounded-2xl shadow-2xl max-w-[95%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[65%] transition-all duration-300"
        style={{
          padding: (() => {
            const value = paddingValue
            const [top, right, bottom, left] = imagePosition.split(' ')
            return `${top === '0' ? '0rem' : top === '1' ? `${value}rem` : `${2 * value}rem`} ${right === '0' ? '0rem' : right === '1' ? `${value}rem` : `${2 * value}rem`} ${bottom === '0' ? '0rem' : bottom === '1' ? `${value}rem` : `${2 * value}rem`} ${left === '0' ? '0rem' : left === '1' ? `${value}rem` : `${2 * value}rem`}`
          })(),
          margin: '0px',
          background:
            subActiveTab === 'Gradient'
              ? linearGradient
              : subActiveTab === 'Solid'
                ? solidColor
                : `url(/test${backgroundImage}.webp)`,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: `brightness(${filters.brightness}) contrast(${filters.contrast}) grayscale(${filters.grayscale}) blur(${filters.blur}px) hue-rotate(${filters.hueRotate}deg) invert(${filters.invert}) opacity(${filters.opacity}) saturate(${filters.saturate}) sepia(${filters.sepia})`,
          overflow: 'hidden',
          opacity: '1',
          scrollMargin: '0px',
        }}
      >
        {isLoading ? (
          <div
            id="imgdiv"
            style={{
              display: 'grid',
              borderRadius: '1px',
              boxShadow: 'rgb(60, 58, 58) 0px 4px 20px 0px',
              position: 'relative',
              transform: imageTransform,
              overflow: 'hidden',
              scale: `${imageScale}`,
              transition: 'all 0.25s ease 0s',
            }}
          >
            <div className="bg-white dark:bg-black p-6 rounded-lg min-w-[400px] max-w-[500px]">
              <label
                htmlFor="small-input"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Enter URL here
              </label>
              <input
                name="title"
                placeholder="Paste youtube video URL here"
                type="text"
                id="default-input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 text-gray-900 dark:text-gray-100 text-sm rounded-lg block w-full p-2.5 mb-4"
              />
              <button
                className="text-sm bg-[#121212] text-white font-semibold px-4 py-1 rounded-md"
                type="button"
                onClick={(e) =>
                  handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
                }
              >
                Get thumbnail
              </button>
            </div>
          </div>
        ) : (
          <div
            id="imgdiv"
            style={{
              display: 'grid',
              borderRadius: `${imageBorder}px`,
              boxShadow: `rgb(60, 58, 58) 0px 4px ${imageShadow}px 0px`,
              position: 'relative',
              transform: imageTransform,
              overflow: 'hidden',
              scale: `${imageScale}`,
              transition: 'all 0.25s ease 0s',
            }}
          >
            <div
              style={{
                backgroundColor: 'rgb(255, 255, 255)',
                fontFamily: 'sans-serif',
                color: 'rgb(0, 0, 0)',
                borderRadius: '1px',
                borderTopWidth: 'medium',
                borderRightWidth: 'medium',
                borderLeftWidth: 'medium',
                borderTopStyle: 'none',
                borderRightStyle: 'none',
                borderLeftStyle: 'none',
                borderTopColor: 'currentcolor',
                borderRightColor: 'currentcolor',
                borderLeftColor: 'currentcolor',
                borderImage: 'none',
                overflow: 'hidden',
                width: '100%',
              }}
            >
              <input
                name="photo"
                type="file"
                accept="image/png, image/jpg, image/jpeg, image/jfif"
                style={{ display: 'none' }}
              />
              <div>
                <img alt="thumbnail" src={url} />
              </div>
            </div>
          </div>
        )}

        {/* Watermark */}
        {showWatermark && (
          <div
            className="absolute bottom-2 right-2 bg-black/30 px-2 py-1 text-white text-sm font-medium rounded cursor-pointer"
            onClick={toggleWatermark}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                toggleWatermark()
              }
            }}
            role="button"
            tabIndex={0}
          >
            {watermarkText}
          </div>
        )}

        {/* Watermark settings (normally hidden, shown here for demonstration) */}
        <div
          className={cn(
            'absolute bottom-10 right-2 bg-black text-white text-xs p-2 rounded-lg border-2 border-gray-500',
            showWaterMarkOptions ? 'block' : 'hidden'
          )}
        >
          <label className="flex items-center mb-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showWatermark}
              onChange={(e) => setShowWatermark(e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600" />
            <span className="ml-3 text-sm font-medium">Show Watermark</span>
          </label>
          <div className="flex items-center my-2 space-x-2">
            {['dark', 'light', 'glassy'].map((style) => (
              <button
                type="button"
                key={style}
                onClick={() => setWatermarkStyle(style)}
                className={`px-2 py-1 rounded text-xs ${
                  watermarkStyle === style
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={watermarkText}
            onChange={(e) => setWatermarkText(e.target.value)}
            placeholder="Watermark text"
            className="w-full bg-gray-800 p-1 text-sm mt-2 rounded"
          />
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={ResetState}
          className="group flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100/80 dark:bg-slate-700/80 hover:bg-slate-200/80 dark:hover:bg-slate-600/80 transition-all duration-200 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100"
        >
          <ArchiveRestoreIcon className="size-4 transition-transform group-hover:rotate-180 duration-300" />
          Reset
        </button>
      </div>
    </div>
  )
}

const EditorSidebar = ({
  text,
  paddingValue,
  setPaddingValue,
  imageScale,
  setImageScale,
  imageBorder,
  setImageBorder,
  imageShadow,
  setImageShadow,
  imageTransform,
  setImageTransform,
  imagePosition,
  setImagePosition,
  filters,
  setFilters,
  fileName,
  setFileName,
  linearGradient,
  setLinearGradient,
  backgroundImage,
  setBackgroundImage,
  subActiveTab,
  setSubActiveTab,
  solidColor,
  setSolidColor,
}: EditorSidebarProps) => {
  const [ResetDialog, confirm] = useConfirm(
    'Reset',
    'Are you sure you want to reset? Changes are irreversible.'
  )

  const [showWatermark, setShowWatermark] = useState(true)
  const [frame, setFrame] = useState('none')
  const [color, setColor] = useState('#000000')
  const [background, setBackground] = useState('#FFFFFF')
  const [activeTabs, setActiveTabs] = useState<ActiveTabs>('Edit')
  const [subActiveTabs, setSubActiveTabs] = useState<SubActiveTabs>('Gradient')
  const [selectedGradient, setSelectedGradient] = useState<string>(Gradients[0])
  const [selectedSolidColor, setSelectedSolidColor] = useState<string>(
    PlainColors[0]
  )
  const [selectedImage, setSelectedImage] = useState<number>(1)
  const [joystickActive, setJoystickActive] = useState(false)
  const [baseTransform, setBaseTransform] = useState(initialTransform)
  const [eventCounter, setEventCounter] = useState(0)

  // extract rgb values from gradient
  function extractRGBValues(gradient: string) {
    const rgbRegex = /rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)/g
    return gradient.match(rgbRegex)
  }

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle range input changes
  }
  const handleGradientChange = (gradient: string) => {
    setSelectedGradient(gradient)
    setLinearGradient(gradient)
  }
  const handleFrameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFrame(e.target.value)
  }
  const handleTransform = (index: number) => {
    if (imageTransform === Transform[index]) {
      setImageTransform(initialTransform)
    } else setImageTransform(Transform[index])
  }
  const handlePosition = (index: number) => {
    if (imagePosition === Position[index]) {
      setImagePosition(initialPosition)
    } else {
      setImagePosition(Position[index])
    }
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters({ ...filters, [name]: value })
  }
  const handleReset = async () => {
    const ok = await confirm()
    if (ok) {
      setFilters(initialFilters as Filters)
      setFileName(initialFileName)
    } else return
  }
  const handleSubActiveTabChange = (tab: SubActiveTabs) => {
    setSubActiveTab(tab)
    setSubActiveTabs(tab)
  }
  const handleImageChange = (num: number) => {
    setBackgroundImage(num)
    setSelectedImage(num)
  }
  const handleSolidColorChange = (color: string) => {
    setSelectedSolidColor(color)
    setSolidColor(color)
  }

  const handleJoystickStart = () => {
    console.log(
      '🎮 JOYSTICK STARTED - capturing base transform:',
      imageTransform
    )
    setJoystickActive(true)
    setBaseTransform(imageTransform)
    setEventCounter(0)
  }

  const handleJoystickMove = (event: {
    x: number | null
    y: number | null
  }) => {
    setEventCounter((prev) => prev + 1)
    console.log('=== JOYSTICK DEBUG #' + (eventCounter + 1) + ' ===')
    console.log('Raw event:', event)
    console.log('X value:', event?.x, 'type:', typeof event?.x)
    console.log('Y value:', event?.y, 'type:', typeof event?.y)
    console.log('Event timestamp:', Date.now())

    // Check if values are in expected range
    const xVal = event?.x ?? 0
    const yVal = event?.y ?? 0
    console.log('Processed values - X:', xVal, 'Y:', yVal)

    // Dead zone handling - ignore very small movements (adjust based on coordinate range)
    const deadZone = Math.abs(xVal) > 50 || Math.abs(yVal) > 50 ? 5 : 0.05 // Adaptive dead zone
    if (Math.abs(xVal) < deadZone && Math.abs(yVal) < deadZone) {
      console.log('Movement within dead zone, ignoring')
      return
    }

    // Adaptive scaling based on coordinate range detection
    let scaleFactorX = 0.3
    let scaleFactorY = 0.3

    // If coordinates are small (likely -1 to 1 range), scale up
    if (Math.abs(xVal) <= 1 && Math.abs(yVal) <= 1) {
      console.log('Detected small coordinate range (-1 to 1), scaling up')
      scaleFactorX = 30 // Scale up significantly
      scaleFactorY = 30
    } else if (Math.abs(xVal) <= 10 && Math.abs(yVal) <= 10) {
      console.log(
        'Detected medium coordinate range (-10 to 10), scaling medium'
      )
      scaleFactorX = 3
      scaleFactorY = 3
    }

    console.log('Using scale factors - X:', scaleFactorX, 'Y:', scaleFactorY)

    // Convert joystick coordinates to rotation degrees
    const rotateY = xVal * scaleFactorX // Scale rotation
    const rotateX = -yVal * scaleFactorY // Negative for intuitive up/down movement

    console.log('Calculated rotations - rotateY:', rotateY, 'rotateX:', rotateX)

    // Create the transform string with perspective
    const transform = `perspective(500px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`
    console.log('Final transform string:', transform)
    console.log('Current imageTransform before update:', imageTransform)
    console.log('Base transform:', baseTransform)

    setImageTransform(transform)
    console.log('=== END JOYSTICK DEBUG ===\n')
  }

  const handleJoystickStop = () => {
    console.log('🛑 JOYSTICK STOPPED - Total events received:', eventCounter)
    setJoystickActive(false)
    // Keep the current position when joystick is released
  }

  const testTransform = () => {
    console.log('Testing manual transform')
    setImageTransform('perspective(500px) rotateY(15deg) rotateX(10deg)')
  }
  return (
    <div
      id="rightAside"
      className="w-full h-full p-4 overflow-auto scrollbar-none"
    >
      <ResetDialog />
      <div className="w-full flex flex-row items-center justify-between rounded-2xl p-3 text-sm font-semibold bg-slate-50/80 dark:bg-slate-700/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 mb-4">
        <button
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-200 font-medium text-sm',
            activeTabs === 'Settings'
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-200/50 dark:shadow-blue-900/50'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-600/50 hover:text-slate-800 dark:hover:text-slate-200'
          )}
          onClick={() => setActiveTabs('Settings')}
        >
          <svg
            className="size-4"
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="none" d="M0 0h24v24H0V0z" />
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
          </svg>
          Settings
        </button>
        <button
          className={cn(
            'px-4 py-2.5 rounded-full transition-all duration-200 font-medium text-sm',
            activeTabs === 'Edit'
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-200/50 dark:shadow-blue-900/50'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-600/50 hover:text-slate-800 dark:hover:text-slate-200'
          )}
          onClick={() => setActiveTabs('Edit')}
        >
          Edit
        </button>
        <button
          className={cn(
            'px-4 py-2.5 rounded-full transition-all duration-200 font-medium text-sm',
            activeTabs === 'Background'
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-200/50 dark:shadow-blue-900/50'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-600/50 hover:text-slate-800 dark:hover:text-slate-200'
          )}
          onClick={() => setActiveTabs('Background')}
        >
          Background
        </button>
      </div>
      {activeTabs === 'Settings' && (
        <div className="p-4 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Quality
              </label>
              <select className="w-full px-3 py-2 rounded-xl bg-slate-50/80 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200">
                <option value="1">1x</option>
                <option value="2">2x</option>
                <option value="4">4x</option>
                <option value="6">6x</option>
                <option value="8">8x</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Format
              </label>
              <select className="w-full px-3 py-2 rounded-xl bg-slate-50/80 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200">
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
                <option value="svg">SVG</option>
                <option value="webp">WEBP</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
              Filters
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400 min-w-0 flex-1">
                  Brightness
                </label>
                <div className="flex items-center gap-3 flex-1 max-w-[200px]">
                  <input
                    name="brightness"
                    className="flex-1 h-2 rounded-full appearance-none bg-slate-200 dark:bg-slate-600 outline-none slider-thumb"
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={filters.brightness}
                    onChange={handleFilterChange}
                  />
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 w-8 text-right">
                    {filters.brightness}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400 min-w-0 flex-1">
                  Contrast
                </label>
                <div className="flex items-center gap-3 flex-1 max-w-[200px]">
                  <input
                    name="contrast"
                    className="flex-1 h-2 rounded-full appearance-none bg-slate-200 dark:bg-slate-600 outline-none slider-thumb"
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={filters.contrast}
                    onChange={handleFilterChange}
                  />
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 w-8 text-right">
                    {filters.contrast}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400 min-w-0 flex-1">
                  Grayscale
                </label>
                <div className="flex items-center gap-3 flex-1 max-w-[200px]">
                  <input
                    name="grayscale"
                    className="flex-1 h-2 rounded-full appearance-none bg-slate-200 dark:bg-slate-600 outline-none slider-thumb"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={filters.grayscale}
                    onChange={handleFilterChange}
                  />
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 w-8 text-right">
                    {filters.grayscale}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400 min-w-0 flex-1">
                  Blur
                </label>
                <div className="flex items-center gap-3 flex-1 max-w-[200px]">
                  <input
                    name="blur"
                    className="flex-1 h-2 rounded-full appearance-none bg-slate-200 dark:bg-slate-600 outline-none slider-thumb"
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={filters.blur}
                    onChange={handleFilterChange}
                  />
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 w-8 text-right">
                    {filters.blur}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400 min-w-0 flex-1">
                  Hue Rotate
                </label>
                <div className="flex items-center gap-3 flex-1 max-w-[200px]">
                  <input
                    name="hueRotate"
                    className="flex-1 h-2 rounded-full appearance-none bg-slate-200 dark:bg-slate-600 outline-none slider-thumb"
                    type="range"
                    min="0"
                    max="360"
                    step="10"
                    value={filters.hueRotate}
                    onChange={handleFilterChange}
                  />
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 w-8 text-right">
                    {filters.hueRotate}°
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400 min-w-0 flex-1">
                  Invert
                </label>
                <div className="flex items-center gap-3 flex-1 max-w-[200px]">
                  <input
                    name="invert"
                    className="flex-1 h-2 rounded-full appearance-none bg-slate-200 dark:bg-slate-600 outline-none slider-thumb"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={filters.invert}
                    onChange={handleFilterChange}
                  />
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 w-8 text-right">
                    {filters.invert}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400 min-w-0 flex-1">
                  Opacity
                </label>
                <div className="flex items-center gap-3 flex-1 max-w-[200px]">
                  <input
                    name="opacity"
                    className="flex-1 h-2 rounded-full appearance-none bg-slate-200 dark:bg-slate-600 outline-none slider-thumb"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={filters.opacity}
                    onChange={handleFilterChange}
                  />
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 w-8 text-right">
                    {filters.opacity}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400 min-w-0 flex-1">
                  Saturate
                </label>
                <div className="flex items-center gap-3 flex-1 max-w-[200px]">
                  <input
                    name="saturate"
                    className="flex-1 h-2 rounded-full appearance-none bg-slate-200 dark:bg-slate-600 outline-none slider-thumb"
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={filters.saturate}
                    onChange={handleFilterChange}
                  />
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 w-8 text-right">
                    {filters.saturate}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400 min-w-0 flex-1">
                  Sepia
                </label>
                <div className="flex items-center gap-3 flex-1 max-w-[200px]">
                  <input
                    name="sepia"
                    className="flex-1 h-2 rounded-full appearance-none bg-slate-200 dark:bg-slate-600 outline-none slider-thumb"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={filters.sepia}
                    onChange={handleFilterChange}
                  />
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 w-8 text-right">
                    {filters.sepia}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              Export Settings
            </h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <svg
                  className="size-4"
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 384 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zM332.1 128H256V51.9l76.1 76.1zM48 464V48h160v104c0 13.3 10.7 24 24 24h104v288H48z" />
                </svg>
                File Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-xl bg-slate-50/80 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Enter filename..."
              />
            </div>
          </div>
          <button
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-medium bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            type="button"
            onClick={handleReset}
          >
            <svg
              className="size-4"
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="none" d="M0 0h24v24H0V0z" />
              <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
            </svg>
            Reset All Settings
          </button>
        </div>
      )}
      {activeTabs === 'Edit' && (
        <>
          <div className="p-4 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                Appearance
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-50/80 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 hover:bg-slate-100/80 dark:hover:bg-slate-600/50 transition-all duration-200">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Text Color
                  </span>
                  <span
                    className="h-4 w-4 rounded-full border border-slate-300 dark:border-slate-500"
                    style={{ backgroundColor: 'rgb(0, 0, 0)' }}
                  />
                </button>
                <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-50/80 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 hover:bg-slate-100/80 dark:hover:bg-slate-600/50 transition-all duration-200">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Background
                  </span>
                  <span
                    className="h-4 w-4 rounded-full border border-slate-300 dark:border-slate-500"
                    style={{ backgroundColor: 'rgb(255, 255, 255)' }}
                  />
                </button>
              </div>
              <div className="space-y-4">
                <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                  Image Controls
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 min-w-0 flex-1">
                      Border Radius
                    </label>
                    <div className="flex items-center gap-3 flex-1 max-w-[200px]">
                      <input
                        className="flex-1 h-2 rounded-full appearance-none bg-slate-200 dark:bg-slate-600 outline-none slider-thumb"
                        type="range"
                        min="0"
                        max="60"
                        step="1"
                        value={imageBorder}
                        onChange={(e) => setImageBorder(Number(e.target.value))}
                      />
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400 w-8 text-right">
                        {imageBorder}px
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 min-w-0 flex-1">
                      Shadow
                    </label>
                    <div className="flex items-center gap-3 flex-1 max-w-[200px]">
                      <input
                        className="flex-1 h-2 rounded-full appearance-none bg-slate-200 dark:bg-slate-600 outline-none slider-thumb"
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={imageShadow}
                        onChange={(e) => setImageShadow(Number(e.target.value))}
                      />
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400 w-8 text-right">
                        {imageShadow}px
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 min-w-0 flex-1">
                      Padding
                    </label>
                    <div className="flex items-center gap-3 flex-1 max-w-[200px]">
                      <input
                        className="flex-1 h-2 rounded-full appearance-none bg-slate-200 dark:bg-slate-600 outline-none slider-thumb"
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        value={paddingValue}
                        onChange={(e) =>
                          setPaddingValue(Number(e.target.value))
                        }
                      />
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400 w-8 text-right">
                        {paddingValue}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 min-w-0 flex-1">
                      Scale
                    </label>
                    <div className="flex items-center gap-3 flex-1 max-w-[200px]">
                      <input
                        className="flex-1 h-2 rounded-full appearance-none bg-slate-200 dark:bg-slate-600 outline-none slider-thumb"
                        type="range"
                        min="0.15"
                        max="2"
                        step="0.1"
                        value={imageScale}
                        onChange={(e) => setImageScale(Number(e.target.value))}
                      />
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400 w-8 text-right">
                        {imageScale}x
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                  3D Transform
                </h4>
                <div className="flex justify-center">
                  <div className="bg-slate-100/80 dark:bg-slate-700/50 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-600/50">
                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3 text-center">
                      Tilt Control
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Joystick
                        size={60}
                        stickSize={25}
                        baseColor="rgba(148, 163, 184, 0.3)"
                        stickColor="rgba(71, 85, 105, 0.8)"
                        start={handleJoystickStart}
                        move={handleJoystickMove}
                        stop={handleJoystickStop}
                        throttle={50}
                      />
                      <button
                        onClick={testTransform}
                        className="text-xs px-2 py-1 bg-blue-500 text-white rounded"
                      >
                        Test Transform
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                Frame & Effects
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Frame Style
                  </label>
                  <select
                    name="category"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50/80 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                  >
                    <option value="none">None</option>
                    <option value="macOS-black">macOS Black</option>
                    <option value="macOS-white">macOS White</option>
                    <option value="photograph">Photograph</option>
                    <option value="black">Black</option>
                    <option value="white">White</option>
                    <option value="dodgerblue">Blue</option>
                    <option value="hotpink">Hotpink</option>
                    <option value="green">Green</option>
                    <option value="blueviolet">Blue Violet</option>
                    <option value="gold">Gold</option>
                  </select>
                </div>
                <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-50/80 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 hover:bg-slate-100/80 dark:hover:bg-slate-600/50 transition-all duration-200">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Shadow Color
                  </span>
                  <span
                    className="h-4 w-4 rounded-full border border-slate-300 dark:border-slate-500"
                    style={{ backgroundColor: 'rgb(30, 30, 30)' }}
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              Transform Presets
            </h4>
            <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-none">
              {[...Array(11)].map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    'flex-shrink-0 w-20 h-20 rounded-2xl border-2 transition-all duration-200 overflow-hidden relative',
                    imageTransform === Transform[index]
                      ? 'border-blue-500 shadow-lg shadow-blue-200/50 dark:shadow-blue-900/50 scale-105'
                      : 'border-slate-300/50 dark:border-slate-500/50 hover:border-slate-400 dark:hover:border-slate-400 hover:scale-105'
                  )}
                  style={{
                    background:
                      'linear-gradient(135deg, #FF002C, #FF0057, #FF0082, #FF00AD, #FF00D8, #C100FF, #8900FF, #5900FF, #2400FF)',
                  }}
                  onClick={() => handleTransform(index)}
                >
                  <div
                    className="w-12 h-12 bg-white/90 border border-slate-200 rounded-lg shadow-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      transform: Transform[index],
                    }}
                  />
                </button>
              ))}
            </div>
            <div className="space-y-3">
              <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                Padding Position
              </h4>
              <div className="flex justify-center">
                <div className="grid grid-cols-3 gap-2 p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/50 dark:border-slate-600/50">
                  {Position.map((position, index) => (
                    <button
                      key={position}
                      className={cn(
                        'w-12 h-8 rounded-lg transition-all duration-200 border-2',
                        imagePosition === position
                          ? 'bg-blue-500 border-blue-500 shadow-lg shadow-blue-200/50 dark:shadow-blue-900/50'
                          : 'bg-slate-100 dark:bg-slate-600 border-slate-300/50 dark:border-slate-500/50 hover:bg-slate-200 dark:hover:bg-slate-500 hover:border-slate-400 dark:hover:border-slate-400'
                      )}
                      onClick={() => handlePosition(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {activeTabs === 'Background' && (
        <>
          {/* sub menu */}
          <div className="w-full flex flex-row items-center justify-center gap-1 rounded-2xl p-2 bg-slate-50/80 dark:bg-slate-700/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 mb-4">
            <button
              className={cn(
                'flex-1 py-2 px-3 rounded-xl font-medium text-sm transition-all duration-200',
                subActiveTabs === 'Gradient'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-600/50 hover:text-slate-800 dark:hover:text-slate-200'
              )}
              onClick={() => handleSubActiveTabChange('Gradient')}
            >
              Gradient
            </button>
            <button
              className={cn(
                'flex-1 py-2 px-3 rounded-xl font-medium text-sm transition-all duration-200',
                subActiveTabs === 'Image'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-600/50 hover:text-slate-800 dark:hover:text-slate-200'
              )}
              onClick={() => handleSubActiveTabChange('Image')}
            >
              Image
            </button>
            <button
              className={cn(
                'flex-1 py-2 px-3 rounded-xl font-medium text-sm transition-all duration-200',
                subActiveTabs === 'Solid'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-600/50 hover:text-slate-800 dark:hover:text-slate-200'
              )}
              onClick={() => handleSubActiveTabChange('Solid')}
            >
              Solid
            </button>
          </div>

          {/* gradient */}
          {subActiveTabs === 'Gradient' && (
            <>
              <Input type="Color" className="w-full h-10" />
              <div className="flex mt-3">
                {extractRGBValues(selectedGradient)?.map((color, index) => (
                  <span
                    style={{
                      background: color,
                      height: '30px',
                      width: '30px',
                      margin: '4px',
                      borderRadius: '4px',
                      border: '1px solid gray',
                      position: 'relative',
                    }}
                    key={color}
                  >
                    <span className="absolute -top-2 -right-1 bg-white dark:bg-[rgb(5,50,50)] flex justify-center items-center rounded-full p-1">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 24 24"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>whatever</title>
                        <path fill="none" d="M0 0h24v24H0V0z" />
                        <path d="m17.66 5.41.92.92-2.69 2.69-.92-.92 2.69-2.69M17.67 3c-.26 0-.51.1-.71.29l-3.12 3.12-1.93-1.91-1.41 1.41 1.42 1.42L3 16.25V21h4.75l8.92-8.92 1.42 1.42 1.41-1.41-1.92-1.92 3.12-3.12c.4-.4.4-1.03.01-1.42l-2.34-2.34c-.2-.19-.45-.29-.7-.29zM6.92 19 5 17.08l8.06-8.06 1.92 1.92L6.92 19z" />
                      </svg>
                    </span>
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3 max-h-[20vh] md:max-h-[40vh] overflow-y-auto p-3 sm:p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/50 dark:border-slate-600/50">
                {Gradients.map((gradient, index) => (
                  <button
                    className={cn(
                      'aspect-square rounded-xl border-2 transition-all duration-200 hover:scale-105 active:scale-95',
                      selectedGradient === gradient
                        ? 'border-blue-500 shadow-lg shadow-blue-200/50 dark:shadow-blue-900/50 scale-105'
                        : 'border-slate-300/50 dark:border-slate-500/50 hover:border-slate-400 dark:hover:border-slate-400'
                    )}
                    style={{ background: gradient }}
                    key={gradient}
                    onClick={() => handleGradientChange(gradient)}
                  />
                ))}
              </div>
            </>
          )}

          {/* image */}
          {subActiveTabs === 'Image' && (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3 max-h-[20vh] md:max-h-[40vh] overflow-y-auto p-3 sm:p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/50 dark:border-slate-600/50">
                {Array.from({ length: 70 }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    className={cn(
                      'aspect-square rounded-xl border-2 transition-all duration-200 hover:scale-105 active:scale-95 overflow-hidden',
                      selectedImage === number
                        ? 'border-blue-500 shadow-lg shadow-blue-200/50 dark:shadow-blue-900/50 scale-105'
                        : 'border-slate-300/50 dark:border-slate-500/50 hover:border-slate-400 dark:hover:border-slate-400'
                    )}
                    onClick={() => handleImageChange(number)}
                  >
                    <img
                      src={`/test${number}.webp`}
                      alt={`bg ${number}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </>
          )}

          {/* solid */}
          {subActiveTabs === 'Solid' && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3 max-h-[20vh] md:max-h-[40vh] overflow-y-auto p-3 sm:p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/50 dark:border-slate-600/50">
              {PlainColors.map((plainColor, index) => (
                <button
                  className={cn(
                    'aspect-square rounded-xl border-2 transition-all duration-200 hover:scale-105 active:scale-95',
                    selectedSolidColor === plainColor
                      ? 'border-blue-500 shadow-lg shadow-blue-200/50 dark:shadow-blue-900/50 scale-105'
                      : 'border-slate-300/50 dark:border-slate-500/50 hover:border-slate-400 dark:hover:border-slate-400'
                  )}
                  style={{ background: plainColor }}
                  key={plainColor}
                  onClick={() => handleSolidColorChange(plainColor)}
                />
              ))}
            </div>
          )}
        </>
      )}

      <div className="p-4 border-t border-slate-200/50 dark:border-slate-600/50">
        <label className="inline-flex items-center gap-3 cursor-pointer">
          <input
            id="showWatermark"
            type="checkbox"
            className="sr-only peer"
            checked={showWatermark}
            onChange={() => setShowWatermark(!showWatermark)}
          />
          <div className="relative w-10 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 shadow-inner" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Show Watermark
          </span>
        </label>
      </div>
      <div className="p-4 border-t border-slate-200/50 dark:border-slate-600/50 space-y-3">
        <a
          className="block w-full p-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          href="/pricing"
        >
          <div className="flex items-center justify-center gap-2 text-white font-semibold">
            <span className="text-2xl">👑</span>
            <span>Upgrade to Pro</span>
          </div>
        </a>
        <p className="text-xs text-center text-slate-600 dark:text-slate-400">
          Get <span className="font-semibold text-orange-500">50% off</span> on{' '}
          <span className="font-semibold">Lifetime</span> deal, use code{' '}
          <span className="font-semibold font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-orange-500">
            NEW50
          </span>
        </p>
      </div>
    </div>
  )
}
