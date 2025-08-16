'use client'
import { ThumbnailEditorLayout } from '@/components/thumbnail-editor'
import { PlatformConfig } from '@/types/thumbnail'

const twitterConfig: PlatformConfig = {
  name: 'Twitter',
  apiEndpoint: '/api/media/twitter',
  placeholderText: 'Paste Tweet URL here',
  defaultFileName: 'twitter_thumbnail_2348239234',
  watermarkText: 'TweetEditor',
  supportedFormats: ['png', 'jpeg', 'webp'],
  defaultFormat: 'png',
  inputLabel: 'Enter Tweet 𝕏 here',
  buttonText: 'Get Tweet',
  validationRules: {
    urlPattern: /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\//,
    requiredDomain: 'twitter',
  },
}

export function TwitterThumbnailTool() {
  return <ThumbnailEditorLayout config={twitterConfig} />
}
