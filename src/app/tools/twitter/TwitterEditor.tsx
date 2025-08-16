'use client'
import { Input } from '@/components/ui/input'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { ResetIcon } from '@radix-ui/react-icons'
import { toast } from 'sonner'
import { Gradients } from '@/constants/gradient'
import { PlainColors } from '@/constants/plainColors'
import { Transform } from '@/constants/transform'
import { Position } from '@/constants/constant'
import extractTweetId, {
  convertDateFormat,
  convertNumber,
  convertViews,
} from './helper'
import { type Tweet } from 'rettiwt-api'
import { Bookmark, HeartIcon, Repeat2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/stateful-button'
import { Joystick } from 'react-joystick-component'

type ActiveTabs = 'Settings' | 'Edit' | 'Background'
type SubActiveTabs = 'Gradient' | 'Image' | 'Solid'
const initialTransform = 'perspective(500px) rotateY(0deg) rotateX(0deg)'
const initialPosition = '1 1 1 1'
const initialFileName = 'twitter_thumbnail_2348239234'
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
  tweetDateAndViews: boolean
  showTweetLikesAndShares: boolean
}

interface EditorSidebarProps {
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
  setLinearGradient: (value: string) => void
  setBackgroundImage: (value: number) => void
  setSubActiveTab: (value: SubActiveTabs) => void
  tweetDateAndViews: boolean
  setTweetDateAndViews: (value: boolean) => void
  showTweetLikesAndShares: boolean
  setShowTweetLikesAndShares: (value: boolean) => void
}

function TwitterEditor() {
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
  const [tweetDateAndViews, setTweetDateAndViews] = useState(false)
  const [showTweetLikesAndShares, setShowTweetLikesAndShares] = useState(true)
  return (
    <>
      <div
        id="maindiv"
        className="flex flex-col sm:flex-row justify-between overflow-auto bg-[#f5f5f5] dark:bg-[#141414]"
        style={{ minHeight: 'calc(-56px + 100vh)' }}
      >
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
          tweetDateAndViews={tweetDateAndViews}
          showTweetLikesAndShares={showTweetLikesAndShares}
        />
        <EditorSidebar
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
          setLinearGradient={setLinearGradient}
          setBackgroundImage={setBackgroundImage}
          setSubActiveTab={setSubActiveTab}
          tweetDateAndViews={tweetDateAndViews}
          setTweetDateAndViews={setTweetDateAndViews}
          showTweetLikesAndShares={showTweetLikesAndShares}
          setShowTweetLikesAndShares={setShowTweetLikesAndShares}
        />
      </div>
    </>
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
  tweetDateAndViews,
  showTweetLikesAndShares,
}: ThumbnailComponentProps) => {
  const [showWatermark, setShowWatermark] = useState(true)
  const [watermarkStyle, setWatermarkStyle] = useState('dark')
  const [watermarkText, setWatermarkText] = useState('TweetEditor')
  const [showWaterMarkOptions, setShowWaterMarkOptions] = useState(false)
  const [url, setUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState(false)
  const [tweet, setTweet] = useState<Tweet | null>(null)
  const [userImage, setUserImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const outerDivRef = useRef<HTMLDivElement>(null)
  const innerDivRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const resizeInnerDiv = () => {
      if (outerDivRef.current && innerDivRef.current) {
        const outerRect = outerDivRef.current.getBoundingClientRect()
        const innerRect = innerDivRef.current.getBoundingClientRect()

        const scale = Math.min(
          outerRect.width / innerRect.width,
          outerRect.height / innerRect.height
        )

        innerDivRef.current.style.transform = `${imageTransform} scale(${scale * imageScale})`
      }
    }

    resizeInnerDiv()
    window.addEventListener('resize', resizeInnerDiv)

    return () => {
      window.removeEventListener('resize', resizeInnerDiv)
    }
  }, [imageTransform, imageScale, paddingValue, imagePosition])

  const getPadding = () => {
    const [top, right, bottom, left] = imagePosition.split(' ')
    return `${top === '0' ? '0rem' : top === '1' ? `${paddingValue}rem` : `${2 * paddingValue}rem`} ${right === '0' ? '0rem' : right === '1' ? `${paddingValue}rem` : `${2 * paddingValue}rem`} ${bottom === '0' ? '0rem' : bottom === '1' ? `${paddingValue}rem` : `${2 * paddingValue}rem`} ${left === '0' ? '0rem' : left === '1' ? `${paddingValue}rem` : `${2 * paddingValue}rem`}`
  }
  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUserImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true)
    setError(false)
    e.preventDefault()
    try {
      const tweetId = extractTweetId(url)
      const response = await fetch('/api/media/twitter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tweetId }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch tweet')
      }

      const data = await response.json()
      setTweet(data)
      setUserImage(data.tweetBy.profileImage)
      setShowSuccess(true)
    } catch {
      setError(true)
      toast.error('Error fetching tweet')
    } finally {
      setIsLoading(false)
    }
  }
  const ResetState = () => {
    setUrl('')
    setIsLoading(false)
    setShowSuccess(false)
    setError(false)
    setTweet(null)
    setUserImage(null)
  }
  const toggleWatermark = () => {
    setShowWaterMarkOptions((prev) => !prev)
  }
  const showForm = !tweet || error

  return (
    <div
      className="flex flex-col  items-center justify-center py-4 w-full"
      style={{ scrollbarWidth: 'none' }}
    >
      <div
        id="ss"
        ref={outerDivRef}
        className="shadow-lg sm:max-w-[50%] md:max-w-[60%]"
        style={{
          padding: getPadding(),
          margin: '0px',
          background:
            subActiveTab === 'Gradient'
              ? linearGradient
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
        {showForm ? (
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
            <div className="bg-white dark:bg-black p-4 rounded-lg min-w-[300px]">
              <label
                htmlFor="small-input"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Enter Tweet 𝕏 here
              </label>
              <input
                name="title"
                placeholder="Paste Tweet URL here"
                type="text"
                id="default-input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 text-gray-900 dark:text-gray-100 text-sm rounded-lg block w-full p-2.5 mb-4"
              />
              <Button
                isLoading={isLoading}
                showSuccess={showSuccess}
                onClick={(e) =>
                  handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
                }
                className="text-sm bg-[#121212] text-white font-semibold px-4 py-2 rounded-md hover:ring-2 hover:ring-gray-600"
                disabled={!url.trim()}
              >
                Get Tweet
              </Button>
            </div>
          </div>
        ) : (
          <div
            id="imgdiv"
            ref={innerDivRef}
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
                padding: '16px',
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
                accept="image/png, image/jpg, image/jpeg,image/jfif"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                ref={fileInputRef}
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={userImage || tweet?.tweetBy?.profileImage}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                    }}
                    alt="profile"
                    onClick={handleImageClick}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleImageClick()
                      }
                    }}
                  />
                  <div
                    style={{
                      marginLeft: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      maxHeight: '40px',
                      height: '15px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span
                        style={{
                          marginBottom: '0px',
                          fontSize: '15px',
                          fontWeight: '600',
                          outline: 'currentcolor',
                          border: 'medium',
                          background: 'none',
                          display: 'inline-block',
                          boxSizing: 'border-box',
                          width: '100%',
                          height: '21px',
                        }}
                      >
                        {tweet?.tweetBy?.fullName}
                      </span>
                      {tweet?.tweetBy?.isVerified && (
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth="0"
                          viewBox="0 0 24 24"
                          color="rgb(29, 155, 240)"
                          height="18"
                          width="18"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{
                            color: 'rgb(29, 155, 240)',
                            height: '20px',
                            marginLeft: '1px',
                          }}
                        >
                          <title>something</title>
                          <path d="M17.03 9.78a.75.75 0 0 0-1.06-1.06l-5.47 5.47-2.47-2.47a.75.75 0 0 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l6-6Z" />
                          <path d="m14.136 1.2 1.375 1.01c.274.201.593.333.929.384l1.687.259a3.61 3.61 0 0 1 3.02 3.021l.259 1.686c.051.336.183.655.384.929l1.01 1.375a3.61 3.61 0 0 1 0 4.272l-1.01 1.375a2.106 2.106 0 0 0-.384.929l-.259 1.687a3.61 3.61 0 0 1-3.021 3.02l-1.686.259a2.106 2.106 0 0 0-.929.384l-1.375 1.01a3.61 3.61 0 0 1-4.272 0l-1.375-1.01a2.106 2.106 0 0 0-.929-.384l-1.687-.259a3.61 3.61 0 0 1-3.02-3.021l-.259-1.686a2.117 2.117 0 0 0-.384-.929L1.2 14.136a3.61 3.61 0 0 1 0-4.272l1.01-1.375c.201-.274.333-.593.384-.929l.259-1.687a3.61 3.61 0 0 1 3.021-3.02l1.686-.259c.336-.051.655-.183.929-.384L9.864 1.2a3.61 3.61 0 0 1 4.272 0Zm-3.384 1.209-1.375 1.01a3.614 3.614 0 0 1-1.59.658l-1.686.258a2.111 2.111 0 0 0-1.766 1.766l-.258 1.686a3.61 3.61 0 0 1-.658 1.589l-1.01 1.376a2.11 2.11 0 0 0 0 2.496l1.01 1.375c.344.469.57 1.015.658 1.59l.258 1.686c.14.911.855 1.626 1.766 1.766l1.686.258a3.61 3.61 0 0 1 1.589.658l1.376 1.01a2.11 2.11 0 0 0 2.496 0l1.375-1.01a3.613 3.613 0 0 1 1.59-.657l1.686-.26a2.11 2.11 0 0 0 1.766-1.765l.258-1.686a3.61 3.61 0 0 1 .658-1.589l1.01-1.376a2.11 2.11 0 0 0 0-2.496l-1.01-1.375a3.613 3.613 0 0 1-.657-1.59l-.26-1.686a2.11 2.11 0 0 0-1.765-1.766l-1.686-.258a3.61 3.61 0 0 1-1.589-.658l-1.376-1.01a2.11 2.11 0 0 0-2.496 0Z" />
                        </svg>
                      )}
                    </div>
                    <span
                      style={{
                        marginBottom: '0px',
                        fontSize: '14px',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        outline: 'currentcolor',
                        border: 'medium',
                        background: 'none',
                        color: 'rgb(83, 100, 113)',
                        display: 'inline-block',
                        width: '100%',
                      }}
                    >
                      {tweet?.tweetBy?.userName}
                    </span>
                  </div>
                </div>
                <div>
                  <img
                    className="h-8 w-8"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_2012_logo.svg/640px-Twitter_2012_logo.svg.png"
                    alt=""
                  />
                </div>
              </div>
              <p
                style={{
                  outline: 'currentcolor',
                  border: 'medium',
                  margin: '8px 0px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  width: '100%',
                }}
              >
                {tweet?.fullText}
              </p>
              <img
                src={tweet?.media?.[0]?.url}
                alt=""
                style={{ width: '100%' }}
              />
            </div>
            {tweetDateAndViews && (
              <div className=" -mt-1 h-10 flex flex-row gap-[3px] px-2 bg-[rgb(255,255,255)] dark:bg-[rgb(20,20,20)] pt-2">
                <p className="text-muted-foreground text-sm">
                  {convertDateFormat(tweet?.createdAt || '')}
                </p>
                <span className="text-muted-foreground text-sm mx-1">·</span>
                <p className=" text-sm font-bold">
                  {convertViews(tweet?.viewCount || 0)}
                </p>
              </div>
            )}
            {showTweetLikesAndShares && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  gap: '4rem',
                }}
                className="bg-[rgb(255,255,255)] dark:bg-[rgb(20,20,20)] px-2 pt-2 pb-5 flex flex-row justify-start items-start -mt-1"
              >
                <div className="flex flex-row gap-[2px] justify-center items-center">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="text-muted-foreground size-[1.27rem]"
                  >
                    <g className="text-muted-foreground">
                      <path
                        d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="0"
                      />
                    </g>
                  </svg>
                  <span className="text-sm font-medium text-muted-foreground">
                    {convertNumber(tweet?.replyCount || 0)}
                  </span>
                </div>

                <div className="flex flex-row gap-[2px] justify-center items-center">
                  <Repeat2 className="size-5 text-muted-foreground" />
                  <span className="text-sm font-medim text-muted-foreground">
                    {convertNumber(tweet?.retweetCount || 0)}
                  </span>
                </div>

                <div className="flex flex-row gap-[2px] justify-center items-center">
                  <HeartIcon className="size-4  text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {convertNumber(tweet?.likeCount || 0)}
                  </span>
                </div>
                <div className="flex flex-row gap-[2px] justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-heart size-4 text-muted-foreground"
                  >
                    <title>views</title>
                    <g>
                      <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z" />
                    </g>
                  </svg>
                  <span className="text-sm font-medium text-muted-foreground">
                    {convertNumber(tweet?.viewCount || 0)}
                  </span>
                </div>
                <div className="flex flex-row gap-3 justify-center items-center pr-5">
                  <Bookmark className="size-5 text-muted-foreground" />
                  <Upload className="size-5 text-muted-foreground" />
                </div>
              </div>
            )}
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
      <div className="flex flex-row justify-between text-end items-end cursor-pointer hover:scale-105 transition-all duration-100 group-hover/reset">
        <ResetIcon
          onClick={ResetState}
          className="size-4 text-gray-500 group-hover/reset:text-gray-900"
        />
      </div>
    </div>
  )
}

const EditorSidebar = ({
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
  setLinearGradient,
  setBackgroundImage,
  setSubActiveTab,
  tweetDateAndViews,
  setTweetDateAndViews,
  showTweetLikesAndShares,
  setShowTweetLikesAndShares,
}: EditorSidebarProps) => {
  const [showWatermark, setShowWatermark] = useState(true)
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

  const handleGradientChange = (gradient: string) => {
    setSelectedGradient(gradient)
    setLinearGradient(gradient)
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
    setFilters(initialFilters as Filters)
    setFileName(initialFileName)
  }
  const handleSubActiveTabChange = (tab: SubActiveTabs) => {
    setSubActiveTab(tab)
    setSubActiveTabs(tab)
  }
  const handleImageChange = (num: number) => {
    setBackgroundImage(num)
    setSelectedImage(num)
  }
  const handleTweetDateAndViewsToggle = () => {
    setTweetDateAndViews(!tweetDateAndViews)
  }
  const handleTweetLikesAndSharesToggle = () => {
    setShowTweetLikesAndShares(!showTweetLikesAndShares)
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
    if (!joystickActive) return

    setEventCounter((prev) => prev + 1)

    const xVal = event.x || 0
    const yVal = event.y || 0

    console.log(`🎮 JOYSTICK MOVE #${eventCounter + 1}:`, {
      raw: { x: event.x, y: event.y },
      processed: { xVal, yVal },
      baseTransform,
    })

    // Scale factors for rotation sensitivity
    const scaleFactorX = 45 // Max 45 degrees rotation on X axis
    const scaleFactorY = 45 // Max 45 degrees rotation on Y axis

    console.log('Using scale factors - X:', scaleFactorX, 'Y:', scaleFactorY)

    // Convert joystick coordinates to rotation degrees
    const rotateY = xVal * scaleFactorX // Scale rotation
    const rotateX = -yVal * scaleFactorY // Negative for intuitive up/down movement

    const newTransform = `perspective(500px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`

    console.log('New transform:', newTransform)
    setImageTransform(newTransform)

    console.log('=== END JOYSTICK DEBUG ===\n')
  }

  const handleJoystickStop = () => {
    console.log('🛑 JOYSTICK STOPPED - Total events received:', eventCounter)
    setJoystickActive(false)
    // Keep the current position when joystick is released
  }
  return (
    <div
      id="rightAside"
      className="w-full justify-center items-center md:justify-normal sm:max-w-[340px] md:w-full bg-white dark:bg-[#1a1a1a] p-2 relative top-0 right-0 z-20 pb-12 scrollbar-none overflow-auto md:h-[calc(100vh-56px)]"
    >
      <div className="w-full flex flex-row items-center justify-between rounded-t-xl p-2 text-xs font-medium border bg-gray-50 dark:bg-[#0f0f0f] dark:border-gray-950">
        <p
          className={cn(
            'px-4 text-center py-2 rounded-lg cursor-pointer dark:bg-[#1a1a1a] font-semibold hover:bg-gray-200 dark:hover:bg-[#121212] mx-1',
            activeTabs === 'Settings' && 'bg-white px-4 shadow-md'
          )}
          onClick={() => setActiveTabs('Settings')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setActiveTabs('Settings')
            }
          }}
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="18"
            width="18"
            xmlns="http://www.w3.org/2000/svg"
            aria-labelledby="settingsIconTitle"
          >
            <title id="settingsIconTitle">Settings</title>
            <path fill="none" d="M0 0h24v24H0V0z" />
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
          </svg>
        </p>
        <p
          className={cn(
            'w-full text-center py-2 rounded-lg cursor-pointer font-semibold hover:bg-gray-200 dark:hover:bg-[#121212] mx-1',
            activeTabs === 'Edit' && 'bg-white px-4 shadow-md'
          )}
          onClick={() => setActiveTabs('Edit')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setActiveTabs('Edit')
            }
          }}
        >
          Edit
        </p>
        <p
          className={cn(
            'w-full text-center py-2 rounded-lg cursor-pointer font-semibold hover:bg-gray-200 dark:hover:bg-[#121212] mx-1',
            activeTabs === 'Background' && 'bg-white px-4 shadow-md'
          )}
          onClick={() => setActiveTabs('Background')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setActiveTabs('Background')
            }
          }}
        >
          Background
        </p>
      </div>
      {activeTabs === 'Settings' && (
        <div className="p-2">
          <div className="flex items-center justify-between mt-2">
            <h6 className="flex items-center text-sm">
              Quality
              <select className="outline-none bg-white dark:bg-[#0f0f0f] mx-2 px-2 border border-gray-600 rounded-lg text-black dark:text-white">
                <option value="1">1x</option>
                <option value="2">2x</option>
                <option value="4">4x</option>
                <option value="6">6x</option>
                <option value="8">8x</option>
              </select>
            </h6>
            <h6 className="flex items-center text-sm">
              Format
              <select className="outline-none bg-white dark:bg-[#0f0f0f] mx-2 px-2 border border-gray-600 rounded-lg text-black dark:text-white">
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
                <option value="svg">SVG</option>
                <option value="webp">WEBP</option>
              </select>
            </h6>
          </div>
          <div className="my-8">
            <div className="flex items-center text-xs mb-2 mt-4 font-medium">
              <label className="flex-shrink-0 w-20">Brightness:</label>
              <input
                name="brightness"
                className="range accent-gray-600"
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={filters.brightness}
                onChange={handleFilterChange}
              />
            </div>
            <div className="flex items-center text-xs mb-2 mt-4 font-medium">
              <label className="flex-shrink-0 w-20">Contrast:</label>
              <input
                name="contrast"
                className="range accent-gray-600"
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={filters.contrast}
                onChange={handleFilterChange}
              />
            </div>
            <div className="flex items-center text-xs mb-2 mt-4 font-medium">
              <label className="flex-shrink-0 w-20">Grayscale:</label>
              <input
                name="grayscale"
                className="range accent-gray-600"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={filters.grayscale}
                onChange={handleFilterChange}
              />
            </div>
            <div className="flex items-center text-xs mb-2 mt-4 font-medium">
              <label className="flex-shrink-0 w-20">Blur:</label>
              <input
                name="blur"
                className="range accent-gray-600"
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={filters.blur}
                onChange={handleFilterChange}
              />
            </div>
            <div className="flex items-center text-xs mb-2 mt-4 font-medium">
              <label className="flex-shrink-0 w-20">Hue-rotate:</label>
              <input
                name="hueRotate"
                className="range accent-gray-600"
                type="range"
                min="0"
                max="360"
                step="10"
                value={filters.hueRotate}
                onChange={handleFilterChange}
              />
            </div>
            <div className="flex items-center text-xs mb-2 mt-4 font-medium">
              <label className="flex-shrink-0 w-20">Invert:</label>
              <input
                name="invert"
                className="range accent-gray-600"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={filters.invert}
                onChange={handleFilterChange}
              />
            </div>
            <div className="flex items-center text-xs mb-2 mt-4 font-medium">
              <label className="flex-shrink-0 w-20">Opacity:</label>
              <input
                name="opacity"
                className="range accent-gray-600"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={filters.opacity}
                onChange={handleFilterChange}
              />
            </div>
            <div className="flex items-center text-xs mb-2 mt-4 font-medium">
              <label className="flex-shrink-0 w-20">Saturate:</label>
              <input
                name="saturate"
                className="range accent-gray-600"
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={filters.saturate}
                onChange={handleFilterChange}
              />
            </div>
            <div className="flex items-center text-xs mb-2 mt-4 font-medium">
              <label className="flex-shrink-0 w-20">Sepia:</label>
              <input
                name="sepia"
                className="range accent-gray-600"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={filters.sepia}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          <div className="flex items-center text-sm mb-4 mt-4">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 384 512"
              className="mr-1"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>File Name</title>
              <path d="M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zM332.1 128H256V51.9l76.1 76.1zM48 464V48h160v104c0 13.3 10.7 24 24 24h104v288H48z" />
            </svg>
            <span className="mx-1">File Name</span>
            <input
              type="text"
              className="outline-none border-b border-gray-400 bg-transparent text-black dark:text-white ml-1 text-xs"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
          </div>
          <button
            className="flex items-center text-sm mt-2 px-4 py-2 rounded-lg font-medium border border-gray-700 bg-white dark:bg-black text-black dark:text-white hover:bg-gray-100 dark:hover:bg-[#121212]"
            type="button"
            onClick={handleReset}
          >
            Reset
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="16"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Reset</title>
              <path fill="none" d="M0 0h24v24H0V0z" />
              <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
            </svg>
          </button>
        </div>
      )}
      {activeTabs === 'Edit' && (
        <>
          <div className="p-4 my-2 rounded-xl text-sm">
            <div>
              <label className="inline-flex items-center m-2 my-4 cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={tweetDateAndViews}
                  onChange={handleTweetDateAndViewsToggle}
                />
                <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600" />
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                  Show Tweet Date and Views
                </span>
              </label>
              <label className="inline-flex items-center m-2 my-4 cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={showTweetLikesAndShares}
                  onChange={handleTweetLikesAndSharesToggle}
                />
                <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600" />
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                  Show comment, Retweets, likes and views
                </span>
              </label>
              <div className="flex flex-row justify-between">
                <div className="flex items-center cursor-pointer mt-4 relative py-0.5 px-3 border border-gray-300 dark:border-gray-600 rounded-2xl mr-4 w-[45%]">
                  <span>Color</span>
                  <span
                    className="h-4 w-4 rounded-full ml-1 border border-gray-400"
                    style={{ backgroundColor: 'rgb(0, 0, 0)' }}
                  />
                </div>
                <div className="flex items-center w-[45%] cursor-pointer mt-4 relative py-0.5 px-3 border border-gray-300 dark:border-gray-600 rounded-2xl">
                  <span>Background</span>
                  <span
                    className="h-4 w-4 rounded-full ml-1 border border-gray-400"
                    style={{ backgroundColor: 'rgb(255, 255, 255)' }}
                  />
                </div>
              </div>
              <div className="flex flex-row justify-between align-center mt-4">
                <div className="flex flex-col items-center justify-center w-[70%]">
                  <div className="flex flex-col items-start justify-center">
                    <div
                      style={{
                        fontSize: '12px',
                        marginBottom: '8px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      <span className="mr-2 md:mr-0" style={{ flex: '1 1 0%' }}>
                        Round
                      </span>
                      <input
                        className="range accent-gray-600 mx-4 w-2/4"
                        type="range"
                        min="0"
                        max="60"
                        step="1"
                        id="roundness"
                        value={imageBorder}
                        onChange={(e) => setImageBorder(Number(e.target.value))}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        marginBottom: '8px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <span className="mr-2 md:mr-0" style={{ flex: '1 1 0%' }}>
                        Shadow
                      </span>
                      <input
                        className="range accent-gray-600 mx-4 w-2/4"
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        id="shadow"
                        value={imageShadow}
                        onChange={(e) => setImageShadow(Number(e.target.value))}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        marginBottom: '8px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <span className="mr-2 md:mr-0" style={{ flex: '1 1 0%' }}>
                        Padding
                      </span>
                      <input
                        className="range accent-gray-600 mx-4 w-2/4"
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        id="pdng"
                        value={paddingValue}
                        onChange={(e) =>
                          setPaddingValue(Number(e.target.value))
                        }
                      />
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        marginBottom: '8px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <span className="mr-2 md:mr-0" style={{ flex: '1 1 0%' }}>
                        Scale
                      </span>
                      <input
                        className="range accent-gray-600 mx-4 w-2/4"
                        type="range"
                        min="0.15"
                        max="2"
                        step="0.1"
                        id="scale"
                        value={imageScale}
                        onChange={(e) => setImageScale(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center border-l border-gray-400 px-4 py-2 w-[28%]">
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 mt-4 rounded-xl text-sm w-full">
            <div className="flex overflow-x-auto scroll-m-0 scrollbar-none">
              {[...Array(11)].map((_, index) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  key={index}
                  className={cn(
                    'flex-shrink-0 w-20 h-20 mr-2 rounded-sm',
                    imageTransform === Transform[index] &&
                      'border-[1px] border-black'
                  )}
                  style={{
                    background:
                      'linear-gradient(135deg, #FF002C, #FF0057, #FF0082, #FF00AD, #FF00D8, #C100FF, #8900FF, #5900FF, #2400FF)',
                    backgroundSize: 'cover',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    filter:
                      'brightness(1) contrast(1) grayscale(0) blur(0px) hue-rotate(0deg) invert(0) opacity(1) saturate(1) sepia(0)',
                    opacity: 1,
                  }}
                  onClick={() => handleTransform(index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setImageTransform(Transform[index])
                    }
                  }}
                >
                  <div
                    className="w-12 h-12 bg-slate-50 border"
                    style={{
                      transform: Transform[index],
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <div className="grid grid-cols-3 w-fit">
                {Position.map((position, index) => (
                  <div
                    key={position}
                    className={cn(
                      'w-16 h-10 m-1 rounded bg-slate-200 dark:bg-slate-700',
                      imagePosition === position && 'border-[1px] border-black'
                    )}
                    onClick={() => handlePosition(index)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handlePosition(index)
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
      {activeTabs === 'Background' && (
        <>
          {/* sub menu */}
          <div className="w-full flex flex-row items-center justify-between rounded-b-xl p-2 text-xs font-medium border bg-gray-50 dark:bg-[#0f0f0f] dark:border-gray-950">
            <p
              className={cn(
                'w-full text-center py-2 rounded-[10px] cursor-pointer  font-semibold hover:bg-gray-200 dark:hover:bg-[#121212] ',
                subActiveTabs === 'Gradient' &&
                  'bg-white dark:bg-[#1a1a1a] shadow-md'
              )}
              onClick={() => handleSubActiveTabChange('Gradient')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleSubActiveTabChange('Gradient')
                }
              }}
            >
              Gradient
            </p>
            <p
              className={cn(
                'w-full text-center py-2 rounded-[10px] cursor-pointer font-semibold hover:bg-gray-200 dark:hover:bg-[#121212] mx-1',
                subActiveTabs === 'Image' &&
                  'bg-white dark:bg-[#1a1a1a] shadow-md'
              )}
              onClick={() => handleSubActiveTabChange('Image')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleSubActiveTabChange('Image')
                }
              }}
            >
              Image
            </p>
            <p
              className={cn(
                'w-full text-center py-2 rounded-[10px] cursor-pointer font-semibold hover:bg-gray-200 dark:hover:bg-[#121212] mx-1',
                subActiveTabs === 'Solid' &&
                  'bg-white dark:bg-[#1a1a1a] shadow-md'
              )}
              onClick={() => handleSubActiveTabChange('Solid')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleSubActiveTabChange('Solid')
                }
              }}
            >
              Solid
            </p>
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
              <div className="flex w-full flex-wrap max-h-[20vh] md:max-h-[40vh] overflow-y-scroll scroll-m-0 justify-center bg-white dark:bg-[#0f0f0f] dark:border-gray-700 border-gray-300 rounded-xl mt-2 p-1">
                {Gradients.map((gradient, index) => (
                  <span
                    className={cn(
                      'block h-8 w-8 m-1 rounded-md border border-gray-400 cursor-pointer',
                      selectedGradient === gradient && 'border-1 rounded-full'
                    )}
                    style={{ background: gradient }}
                    key={gradient}
                    onClick={() => handleGradientChange(gradient)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleGradientChange(gradient)
                      }
                    }}
                  />
                ))}
              </div>
            </>
          )}

          {/* image */}
          {subActiveTabs === 'Image' && (
            <>
              <div className="flex w-full flex-wrap max-h-[20vh] md:max-h-[40vh] overflow-y-scroll scroll-m-0 justify-center bg-white dark:bg-[#0f0f0f] dark:border-gray-700 border-gray-300 rounded-xl mt-2 p-1">
                {Array.from({ length: 70 }, (_, i) => i + 1).map((number) => (
                  <img
                    key={number}
                    src={`/test${number}.webp`}
                    alt={`bg ${number}`}
                    className={cn(
                      'h-12 w-12 m-1 aspect-square rounded-sm object-cover',
                      selectedImage === number && ' rounded-full'
                    )}
                    onClick={() => handleImageChange(number)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleImageChange(number)
                      }
                    }}
                  />
                ))}
              </div>
            </>
          )}

          {/* solid */}
          {subActiveTabs === 'Solid' && (
            <div className="flex w-full flex-wrap max-h-[20vh] md:max-h-[40vh] overflow-y-scroll scroll-m-0 justify-center bg-white dark:bg-[#0f0f0f] dark:border-gray-700 border-gray-300 rounded-xl mt-2 p-1">
              {PlainColors.map((plainColor, index) => (
                <span
                  className={cn(
                    'block h-8 w-8 m-1 rounded-md border border-gray-400 cursor-pointer',
                    selectedSolidColor === plainColor && 'border-1 rounded-full'
                  )}
                  style={{ background: plainColor }}
                  key={plainColor}
                  onClick={() => setSelectedSolidColor(plainColor)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedGradient(plainColor)
                    }
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}

      <label className="inline-flex items-center m-2 my-8 cursor-pointer">
        <input
          id="showWatermark"
          type="checkbox"
          className="sr-only peer"
          value=""
          checked={showWatermark}
          onChange={() => setShowWatermark(!showWatermark)}
        />
        <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600" />
        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-100">
          Show Watermark
        </span>
      </label>
    </div>
  )
}

export default TwitterEditor
