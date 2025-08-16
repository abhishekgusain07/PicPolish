'use client'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  ArrowLeftFromLine,
  ArrowRightFromLine,
  Home,
  PanelLeft,
  Play,
  Settings,
  Camera,
  Twitter,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  useSidebar,
} from './ui/sidebar'

export const ToolsSidebar = () => {
  const { state } = useSidebar()
  const pathname = usePathname()
  const isCollapsed = state === 'collapsed'
  const { toggleSidebar } = useSidebar()

  return (
    <Sidebar
      collapsible="icon"
      side="left"
      className="border-r border-border/40"
    >
      <SidebarHeader className="border-b border-border/40 p-4">
        <div className="flex items-center justify-start gap-2">
          <button
            onClick={toggleSidebar}
            className="h-8 w-8 rounded-md hover:bg-accent/50 transition-colors flex items-center justify-center group/toggle-button flex-shrink-0"
          >
            <PanelLeft className="h-4 w-4 transition-all duration-200 group-hover/toggle-button:opacity-0 group-hover/toggle-button:scale-75" />
            <div className="absolute transition-all duration-200 opacity-0 scale-75 group-hover/toggle-button:opacity-100 group-hover/toggle-button:scale-100">
              {isCollapsed ? (
                <ArrowRightFromLine className="h-4 w-4" />
              ) : (
                <ArrowLeftFromLine className="h-4 w-4" />
              )}
            </div>
          </button>
          <div
            className={cn(
              'flex items-center gap-1 transition-all duration-200 ease-out',
              isCollapsed
                ? 'opacity-0 w-0 overflow-hidden sr-only'
                : 'opacity-100'
            )}
          >
            <p className={cn('text-sm/6 text-stone-800 ')}>PicPolish</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Tools Group */}
        <SidebarGroup>
          <SidebarGroupLabel
            className={cn(
              'transition-all duration-200 ease-out px-3',
              isCollapsed
                ? 'opacity-0 w-0 overflow-hidden sr-only'
                : 'opacity-100'
            )}
          >
            Tools Hub
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <Link
              href="/tools"
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  className:
                    'w-full justify-start gap-3 px-4 py-3 text-base min-h-[44px]',
                }),
                pathname === '/tools' &&
                  'bg-stone-200 hover:bg-stone-200 text-accent-foreground'
              )}
            >
              <Home className="size-5 flex-shrink-0" />
              <span
                className={cn(
                  'transition-all duration-200 ease-out text-base',
                  isCollapsed
                    ? 'opacity-0 w-0 overflow-hidden sr-only'
                    : 'opacity-100'
                )}
              >
                Home
              </span>
            </Link>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Content Creation Group */}
        <SidebarGroup>
          <SidebarGroupLabel
            className={cn(
              'transition-all duration-200 ease-out px-3',
              isCollapsed
                ? 'opacity-0 w-0 overflow-hidden sr-only'
                : 'opacity-100'
            )}
          >
            Content Creation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="flex flex-col gap-1">
              <Link
                href="/tools/youtube"
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                    className:
                      'justify-start gap-3 px-4 py-3 text-base min-h-[44px]',
                  }),
                  pathname.includes('/tools/youtube') &&
                    'bg-stone-200 hover:bg-stone-200 text-accent-foreground'
                )}
              >
                <Play className="size-5 flex-shrink-0" />
                <span
                  className={cn(
                    'transition-all duration-200 ease-out text-base',
                    isCollapsed
                      ? 'opacity-0 w-0 overflow-hidden sr-only'
                      : 'opacity-100'
                  )}
                >
                  YouTube Tool
                </span>
              </Link>

              <Link
                href="/tools/twitter"
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                    className:
                      'justify-start gap-3 px-4 py-3 text-base min-h-[44px]',
                  }),
                  pathname === '/tools/twitter' &&
                    'bg-stone-200 hover:bg-stone-200 text-accent-foreground'
                )}
              >
                <Twitter className="size-5 flex-shrink-0" />
                <span
                  className={cn(
                    'transition-all duration-200 ease-out text-base',
                    isCollapsed
                      ? 'opacity-0 w-0 overflow-hidden sr-only'
                      : 'opacity-100'
                  )}
                >
                  Twitter Tool
                </span>
              </Link>

              <Link
                href="/tools/screenshot"
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                    className:
                      'justify-start gap-3 px-4 py-3 text-base min-h-[44px]',
                  }),
                  pathname === '/tools/screenshot' &&
                    'bg-stone-200 hover:bg-stone-200 text-accent-foreground'
                )}
              >
                <Camera className="size-5 flex-shrink-0" />
                <span
                  className={cn(
                    'transition-all duration-200 ease-out text-base',
                    isCollapsed
                      ? 'opacity-0 w-0 overflow-hidden sr-only'
                      : 'opacity-100'
                  )}
                >
                  Screenshot Tool
                </span>
              </Link>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-4">
        {/* Settings when expanded */}
        <div
          className={cn(
            'transition-all duration-200 ease-out overflow-hidden',
            isCollapsed ? 'opacity-0 max-h-0' : 'opacity-100 max-h-[1000px]'
          )}
        >
          <div className="flex flex-col gap-2">
            <Link
              href="/tools/settings"
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  className:
                    'w-full justify-start gap-3 px-4 py-3 text-base min-h-[44px]',
                }),
                pathname === '/tools/settings' &&
                  'bg-stone-200 hover:bg-stone-200 text-accent-foreground'
              )}
            >
              <Settings className="size-5 flex-shrink-0" />
              <span className="text-base">Settings</span>
            </Link>
          </div>
        </div>

        {/* Settings when collapsed */}
        <div
          className={cn(
            'transition-all duration-0 ease-out overflow-hidden',
            isCollapsed ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0'
          )}
        >
          <div className="flex flex-col gap-2">
            <Link
              href="/tools/settings"
              className={buttonVariants({
                variant: 'ghost',
                className: 'text-muted-foreground hover:text-foreground',
              })}
            >
              <Settings className="size-5" />
            </Link>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
