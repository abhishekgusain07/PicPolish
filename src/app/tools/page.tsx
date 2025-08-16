'use client'

import Link from 'next/link'
import { useState, useMemo, useEffect } from 'react'
import DuolingoBadge from '@/components/ui/duolingo-badge'
import DuolingoButton from '@/components/ui/duolingo-button'
import { tools, getToolStats } from '@/constants/tools'
import { cn } from '@/lib/utils'
import { Search, Grid, List, FileText, ArrowRight } from 'lucide-react'

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const toolStats = getToolStats()

  // Load view mode from localStorage on mount
  useEffect(() => {
    const savedViewMode = localStorage.getItem('picpolish-tools-view-mode')
    if (savedViewMode === 'grid' || savedViewMode === 'list') {
      setViewMode(savedViewMode)
    }
  }, [])

  // Save view mode to localStorage when it changes
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode)
    localStorage.setItem('picpolish-tools-view-mode', mode)
  }

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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  PicPolish Tools
                </h1>
                <DuolingoBadge
                  variant="achievement"
                  className="px-2 w-fit"
                  size="md"
                >
                  {toolStats.totalTools} tools
                </DuolingoBadge>
              </div>
              <p className="text-base sm:text-lg text-gray-600 max-w-prose">
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
                aria-label="Search tools"
                className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors bg-white shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <button
                  onClick={() => handleViewModeChange('grid')}
                  aria-label="Grid view"
                  aria-pressed={viewMode === 'grid'}
                  className={cn(
                    'p-3 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                    viewMode === 'grid'
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'text-gray-400 hover:text-gray-600'
                  )}
                >
                  <Grid className="size-5" />
                </button>
                <button
                  onClick={() => handleViewModeChange('list')}
                  aria-label="List view"
                  aria-pressed={viewMode === 'list'}
                  className={cn(
                    'p-3 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
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

          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
            <DuolingoBadge
              variant="achievement"
              size="md"
              className="text-xs sm:text-sm"
            >
              ⭐ {toolStats.popularCount} Popular
            </DuolingoBadge>
            <DuolingoBadge
              variant="streak"
              size="md"
              className="text-xs sm:text-sm"
            >
              🎨 {toolStats.totalAssets} Assets
            </DuolingoBadge>
            <DuolingoBadge
              variant="level"
              size="md"
              className="text-xs sm:text-sm"
            >
              📱 {toolStats.categoryCounts.social || 0} Social
            </DuolingoBadge>
            <DuolingoBadge
              variant="xp"
              size="md"
              className="text-xs sm:text-sm"
            >
              🖼️ {toolStats.categoryCounts.image || 0} Image
            </DuolingoBadge>
            {searchQuery && (
              <DuolingoBadge
                variant="gray"
                size="md"
                className="text-xs sm:text-sm"
              >
                🔍 {filteredTools.length} Found
              </DuolingoBadge>
            )}
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
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
                : 'flex flex-col space-y-4'
            )}
          >
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                className={cn(
                  'group relative h-full',
                  viewMode === 'list' ? 'w-full' : ''
                )}
              >
                <Link
                  href={tool.href}
                  className={cn(
                    'block h-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-2xl',
                    viewMode === 'list' ? 'w-full' : ''
                  )}
                >
                  <div
                    className={cn(
                      'bg-white rounded-2xl border-2 border-gray-200 hover:border-indigo-300 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 p-6',
                      viewMode === 'list'
                        ? 'flex items-center gap-6'
                        : 'h-full flex flex-col justify-between'
                    )}
                  >
                    <div
                      className={cn(
                        'flex flex-wrap items-center gap-2 mb-4',
                        viewMode === 'list' ? 'mb-0 flex-shrink-0' : ''
                      )}
                    >
                      <DuolingoBadge className="px-2" variant="achievement">
                        {tool.category}
                      </DuolingoBadge>
                      {tool.isPopular && (
                        <DuolingoBadge className="px-2" variant="streak">
                          popular
                        </DuolingoBadge>
                      )}
                      {tool.assetCount && (
                        <DuolingoBadge className="px-2" variant="level">
                          {tool.assetCount} assets
                        </DuolingoBadge>
                      )}
                    </div>

                    <div
                      className={cn(
                        viewMode === 'list' ? 'flex-1 min-w-0' : ''
                      )}
                    >
                      <div
                        className={cn(
                          'flex items-center gap-3 mb-3',
                          viewMode === 'list' ? 'mb-2' : ''
                        )}
                      >
                        <div
                          className={`text-3xl ${viewMode === 'list' ? 'text-2xl' : ''}`}
                        >
                          {tool.icon}
                        </div>
                        <h3
                          className={cn(
                            'font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors',
                            viewMode === 'list'
                              ? 'text-lg line-clamp-1'
                              : 'text-xl line-clamp-2'
                          )}
                        >
                          {tool.name}
                        </h3>
                      </div>

                      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">
                        {tool.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {tool.features.slice(0, 3).map((feature, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div
                      className={cn(
                        'flex items-center justify-between',
                        viewMode === 'list'
                          ? 'flex-shrink-0 flex-col items-end gap-1'
                          : 'mt-auto pt-4'
                      )}
                    >
                      <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 group-hover:text-indigo-700 transition-colors">
                        <span>Open Tool</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
