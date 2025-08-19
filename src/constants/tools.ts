export interface Tool {
  id: string
  name: string
  description: string
  href: string
  category: 'image' | 'social' | 'design'
  icon: string
  gradient: string
  features: string[]
  isPopular?: boolean
  assetCount?: number
}

export const toolCategories = {
  image: {
    name: 'Image Tools',
    description: 'Professional image editing and enhancement tools',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    badgeVariant: 'achievement' as const,
    icon: '🖼️',
  },
  social: {
    name: 'Social Media',
    description: 'Tools for creating engaging social media content',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    badgeVariant: 'streak' as const,
    icon: '📱',
  },
  design: {
    name: 'Design Assets',
    description: 'Colors, gradients, and styling resources',
    color: 'bg-green-100 text-green-800 border-green-200',
    badgeVariant: 'level' as const,
    icon: '🎨',
  },
}

export const tools: Tool[] = [
  {
    id: 'youtube-thumbnail',
    name: 'YouTube Thumbnail Tool',
    description:
      'Extract and beautify YouTube video thumbnails instantly with professional editing capabilities.',
    href: '/tools/youtube',
    category: 'image',
    icon: '🎬',
    gradient: 'from-pink-500 to-red-500',
    features: [
      'High-quality extraction',
      'Instant beautification',
      'Multiple formats',
    ],
    isPopular: true,
  },
  {
    id: 'twitter-tweet',
    name: 'Twitter Tweet Tool',
    description:
      'Transform tweets into beautiful visuals for sharing anywhere with customizable styling.',
    href: '/tools/twitter',
    category: 'social',
    icon: '🐦',
    gradient: 'from-blue-500 to-cyan-500',
    features: [
      'Beautiful visuals',
      'Custom styling',
      'Multiple export formats',
    ],
    isPopular: true,
  },
  {
    id: 'screenshot-tool',
    name: 'Screenshot Tool',
    description:
      'Upload screenshots and present them in a polished, professional way.',
    href: '/tools/screenshot',
    category: 'image',
    icon: '🖼️',
    gradient: 'from-purple-500 to-indigo-500',
    features: [
      'Professional presentation',
      'Multiple frames',
      'Instant polish',
    ],
  },
  {
    id: 'polaroid-tool',
    name: 'Polaroid Images',
    description:
      'Transform your photos into beautiful polaroid-style images with custom frames and text.',
    href: '/tools/polaroid',
    category: 'image',
    icon: '📸',
    gradient: 'from-amber-500 to-orange-500',
    features: ['Multiple styles', 'Custom text', 'Multi-image support'],
    isPopular: true,
  },
  // {
  //   id: 'gradient-collection',
  //   name: 'Gradient Collection',
  //   description:
  //     'Access a curated collection of 32 beautiful gradients for your designs.',
  //   href: '/tools/gradients',
  //   category: 'design',
  //   icon: '🌈',
  //   gradient: 'from-orange-500 to-pink-500',
  //   features: ['32 gradients', 'CSS ready', 'Professional quality'],
  //   assetCount: 32,
  // },
  // {
  //   id: 'color-palette',
  //   name: 'Color Palette',
  //   description:
  //     'Professional color collection with 38 carefully selected colors.',
  //   href: '/tools/colors',
  //   category: 'design',
  //   icon: '🎨',
  //   gradient: 'from-green-500 to-teal-500',
  //   features: ['38 colors', 'RGB values', 'Design ready'],
  //   assetCount: 38,
  // },
  // {
  //   id: 'transform-effects',
  //   name: 'Transform Effects',
  //   description:
  //     'Creative CSS transforms and 3D effects for modern web design.',
  //   href: '/tools/transforms',
  //   category: 'design',
  //   icon: '🔄',
  //   gradient: 'from-indigo-500 to-purple-500',
  //   features: ['3D effects', 'CSS transforms', 'Modern styling'],
  //   assetCount: 13,
  // },
]

export const getToolsByCategory = (category?: string) => {
  if (!category || category === 'all') return tools
  return tools.filter((tool) => tool.category === category)
}

export const getPopularTools = () => {
  return tools.filter((tool) => tool.isPopular)
}

export const searchTools = (query: string) => {
  if (!query.trim()) return tools

  const searchLower = query.toLowerCase()
  return tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchLower) ||
      tool.description.toLowerCase().includes(searchLower) ||
      tool.features.some((feature) =>
        feature.toLowerCase().includes(searchLower)
      )
  )
}

export const getToolStats = () => {
  const totalTools = tools.length
  const totalAssets = tools.reduce(
    (sum, tool) => sum + (tool.assetCount || 0),
    0
  )
  const categoryCounts = tools.reduce(
    (acc, tool) => {
      acc[tool.category] = (acc[tool.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return {
    totalTools,
    totalAssets,
    categoryCounts,
    popularCount: getPopularTools().length,
  }
}
