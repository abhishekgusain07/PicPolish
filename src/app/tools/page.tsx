'use client'
import Link from 'next/link'
import { Camera, Video, FileImage } from 'lucide-react'

const tools = [
  {
    name: 'Screenshot Tool',
    description:
      'Capture and edit screenshots with advanced editing capabilities',
    href: '/tools/screenshot',
    icon: Camera,
    gradient: 'from-slate-100 to-gray-200',
    hoverGradient: 'hover:from-slate-200 hover:to-gray-300',
  },
  {
    name: 'YouTube Thumbnails',
    description: 'Create stunning thumbnails for your YouTube videos',
    href: '/tools/youtube',
    icon: Video,
    gradient: 'from-gray-100 to-slate-200',
    hoverGradient: 'hover:from-gray-200 hover:to-slate-300',
  },
  {
    name: 'Twitter Images',
    description: 'Design and optimize images for Twitter posts',
    href: '/tools/twitter',
    icon: FileImage,
    gradient: 'from-stone-100 to-gray-200',
    hoverGradient: 'hover:from-stone-200 hover:to-gray-300',
  },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900 mb-4">
            Creative Tools
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional-grade tools for content creation, image editing, and
            visual design
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => {
            const IconComponent = tool.icon
            return (
              <Link key={tool.name} href={tool.href} className="group block">
                <div
                  className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${tool.gradient} ${tool.hoverGradient} border border-gray-200 transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.02] group-hover:border-gray-300`}
                >
                  {/* Card Content */}
                  <div className="p-8">
                    {/* Icon */}
                    <div className="mb-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-sm border border-gray-200 group-hover:shadow-md transition-shadow">
                        <IconComponent className="w-6 h-6 text-gray-700" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-medium text-gray-900 group-hover:text-black transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {tool.description}
                      </p>
                    </div>

                    {/* Arrow indicator */}
                    <div className="mt-6 flex items-center text-gray-500 group-hover:text-gray-700 transition-colors">
                      <span className="text-sm font-medium mr-2">
                        Open tool
                      </span>
                      <svg
                        className="w-4 h-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Subtle accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 border border-gray-200">
            <span className="text-sm text-gray-600 font-medium">
              More tools coming soon
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
