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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from './ui/sidebar'

export const ToolsSidebar = () => {
  const { state, toggleSidebar } = useSidebar()
  const pathname = usePathname()
  const isCollapsed = state === 'collapsed'

  return (
    <Sidebar
      collapsible="icon"
      side="left"
      className="border-r border-border/40"
    >
      <SidebarHeader className="border-b border-border/40 p-2">
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
          {!isCollapsed && (
            <p className="text-sm/6 text-stone-800 transition-opacity duration-200">
              PicPolish
            </p>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Tools Group */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="px-3 transition-opacity duration-200">
              Tools Hub
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/tools'}
                  tooltip="Home"
                >
                  <Link href="/tools">
                    <Home className="size-5" />
                    {!isCollapsed && <span>Home</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Content Creation Group */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="px-3 transition-opacity duration-200">
              Content Creation
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.includes('/tools/youtube')}
                  tooltip="YouTube Tool"
                >
                  <Link href="/tools/youtube">
                    <Play className="size-5" />
                    {!isCollapsed && <span>YouTube Tool</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/tools/twitter'}
                  tooltip="Twitter Tool"
                >
                  <Link href="/tools/twitter">
                    <Twitter className="size-5" />
                    {!isCollapsed && <span>Twitter Tool</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/tools/screenshot'}
                  tooltip="Screenshot Tool"
                >
                  <Link href="/tools/screenshot">
                    <Camera className="size-5" />
                    {!isCollapsed && <span>Screenshot Tool</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/tools/settings'}
              tooltip="Settings"
            >
              <Link href="/tools/settings">
                <Settings className="size-5" />
                {!isCollapsed && <span>Settings</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
