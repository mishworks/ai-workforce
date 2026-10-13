import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ChatList } from "@/components/chat-list"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar chatList={<ChatList />} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
