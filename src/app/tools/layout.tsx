import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { ToolsSidebar } from '@/components/tools-sidebar'

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <ToolsSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
