'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DuolingoBadge from '@/components/ui/duolingo-badge'
import DuolingoButton from '@/components/ui/duolingo-button'
import { tools, getToolStats } from '@/constants/tools'
import { cn } from '@/lib/utils'
import { Search, Grid, List, FileText, ArrowRight } from 'lucide-react'

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const toolStats = getToolStats()

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return tools

    const searchLower = searchQuery.toLowerCase()
    return tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(searchLower) ||
        tool.description.toLowerCase().includes(searchLower) ||
        tool.features.some((feature) =>
          feature.toLowerCase().includes(searchLower)
        )
    )
  }, [searchQuery])

  return (
    <div className="relative z-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-gray-900">
                  PicPolish Tools
                </h1>
                <DuolingoBadge variant="achievement" className="px-2" size="md">
                  {toolStats.totalTools}
                </DuolingoBadge>
              </div>
              <p className="text-lg text-gray-600 max-w-prose">
                A collection of powerful, beautiful tools to make your content
                shine. Transform images, create stunning visuals, and access
                premium design assets.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors bg-white shadow-sm"
              />
            </div>

            <div className="flex gap-2">
              <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-3 transition-colors',
                    viewMode === 'grid'
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'text-gray-400 hover:text-gray-600'
                  )}
                >
                  <Grid className="size-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-3 transition-colors',
                    viewMode === 'list'
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'text-gray-400 hover:text-gray-600'
                  )}
                >
                  <List className="size-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {filteredTools.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <FileText className="size-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tools found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'No tools available at the moment'}
            </p>
          </div>
        ) : (
          <div
            className={cn(
              'gap-2',
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'flex flex-col space-y-4'
            )}
          >
            {/* Tool cards will be implemented in Phase 4 */}
            {filteredTools.map((tool) => (
              <motion.div
                key={tool.id}
                whileHover={{ scale: viewMode === 'grid' ? 1.04 : 1.01 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                className={cn(
                  'group relative h-full',
                  viewMode === 'list' ? 'w-full' : ''
                )}
              >
                <Card className="overflow-hidden rounded-2xl shadow-xl border-none h-full">
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
        )}
      </div>
    </div>
  )
}
