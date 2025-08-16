'use client'
import { ThumbnailEditorLayout } from '@/components/thumbnail-editor'
import { PlatformConfig } from '@/types/thumbnail'

const youtubeConfig: PlatformConfig = {
  name: 'YouTube',
  apiEndpoint: '/api/youtube',
  placeholderText: 'Paste youtube video URL here',
  defaultFileName: 'youtube_thumbnail_2348239234',
  watermarkText: 'ToolsArsenal',
  supportedFormats: ['png', 'jpeg', 'webp'],
  defaultFormat: 'png',
  inputLabel: 'Enter URL here',
  buttonText: 'Get thumbnail',
  validationRules: {
    urlPattern: /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/,
    requiredDomain: 'youtube',
  },
}

export function YoutubeThumbnailTool() {
  return <ThumbnailEditorLayout config={youtubeConfig} />
}
