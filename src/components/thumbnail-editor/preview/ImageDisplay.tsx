import { useState } from 'react'
import { EditorState, ImageState, PlatformConfig } from '@/types/thumbnail'

interface ImageDisplayProps {
  imageState: ImageState
  editorState: EditorState
  onImageFetch: (url: string) => Promise<void>
  config: PlatformConfig
}

export function ImageDisplay({
  imageState,
  editorState,
  onImageFetch,
  config,
}: ImageDisplayProps) {
  const [inputUrl, setInputUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inputUrl.trim()) {
      await onImageFetch(inputUrl.trim())
    }
  }

  const getImageContainerStyle = () => ({
    display: 'grid',
    borderRadius: imageState.isLoading ? '1px' : `${editorState.imageBorder}px`,
    boxShadow: imageState.isLoading
      ? 'rgb(60, 58, 58) 0px 4px 20px 0px'
      : `rgb(60, 58, 58) 0px 4px ${editorState.imageShadow}px 0px`,
    position: 'relative' as const,
    transform: editorState.imageTransform,
    overflow: 'hidden',
    scale: `${editorState.imageScale}`,
    transition: 'all 0.25s ease 0s',
  })

  if (imageState.isLoading) {
    return (
      <div style={getImageContainerStyle()}>
        <div className="bg-white dark:bg-black p-6 rounded-lg min-w-[400px] max-w-[500px]">
          <label
            htmlFor="url-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            {config.inputLabel}
          </label>
          <form onSubmit={handleSubmit}>
            <input
              id="url-input"
              name="url"
              placeholder={config.placeholderText}
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 text-gray-900 dark:text-gray-100 text-sm rounded-lg block w-full p-2.5 mb-4"
              required
            />
            <button
              type="submit"
              className="text-sm bg-[#121212] text-white font-semibold px-4 py-1 rounded-md hover:bg-[#2a2a2a] transition-colors"
              disabled={!inputUrl.trim()}
            >
              {config.buttonText}
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (imageState.error) {
    return (
      <div style={getImageContainerStyle()}>
        <div className="bg-white dark:bg-black p-6 rounded-lg min-w-[400px] max-w-[500px] text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm">
              Failed to load {config.name.toLowerCase()} thumbnail
            </p>
          </div>
          <button
            onClick={() => setInputUrl('')}
            className="text-sm bg-blue-500 text-white font-semibold px-4 py-1 rounded-md hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={getImageContainerStyle()}>
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
          <img
            alt={`${config.name} thumbnail`}
            src={imageState.url}
            style={{ width: '100%', height: 'auto', display: 'block' }}
            onError={() => {
              // Handle image load error if needed
            }}
          />
        </div>
      </div>
    </div>
  )
}
