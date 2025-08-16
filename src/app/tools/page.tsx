'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

const tools = [
  {
    name: 'YouTube Thumbnail Tool',
    description: 'Extract and beautify YouTube video thumbnails instantly.',
    href: '/tools/youtube',
    gradient: 'from-pink-500 to-red-500',
    icon: '🎬',
  },
  {
    name: 'Twitter Tweet Tool',
    description: 'Turn tweets into beautiful visuals for sharing anywhere.',
    href: '/tools/twitter',
    gradient: 'from-blue-500 to-cyan-500',
    icon: '🐦',
  },
  {
    name: 'Screenshot Tool',
    description: 'Upload screenshots and present them in a polished way.',
    href: '/tools/screenshot',
    gradient: 'from-purple-500 to-indigo-500',
    icon: '🖼️',
  },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Tools Arsenal
          </h1>
          <p className="mt-2 text-gray-600 text-lg">
            A collection of simple, beautiful tools to make your content shine
            ✨
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, idx) => (
            <motion.div
              key={tool.name}
              whileHover={{ scale: 1.04 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            >
              <Card className="overflow-hidden rounded-2xl shadow-xl border-none">
                <div
                  className={`h-28 bg-gradient-to-r ${tool.gradient} flex items-center justify-center text-5xl`}
                >
                  {tool.icon}
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{tool.description}</p>
                  <Link
                    href={tool.href}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-pink-500 hover:text-pink-600"
                  >
                    Open Tool <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
