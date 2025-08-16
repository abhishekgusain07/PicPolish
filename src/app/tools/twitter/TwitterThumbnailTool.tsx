'use client'
import { ThumbnailEditorLayout } from '@/components/thumbnail-editor'
import { PlatformConfig } from '@/types/thumbnail'

const twitterConfig: PlatformConfig = {
  name: 'Twitter',
  apiEndpoint: '/api/twitter',
  placeholderText: 'Paste twitter post URL here',
  defaultFileName: 'twitter_thumbnail_2348239234',
  watermarkText: 'TweetEditor',
  supportedFormats: ['png', 'jpeg', 'webp'],
  defaultFormat: 'png',
  inputLabel: 'Enter Twitter URL here',
  buttonText: 'Get tweet image',
  validationRules: {
    urlPattern: /^(https?:\/\/)?(www\.)?(twitter\.com\/|x\.com\/)/,
    requiredDomain: 'twitter',
  },
}

export function TwitterThumbnailTool() {
  return <ThumbnailEditorLayout config={twitterConfig} />
}
