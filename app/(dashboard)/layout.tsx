import { cookies } from "next/headers"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ChatList } from "@/components/chat-list"
import { ChatSearchDialog } from "@/components/chat-search-dialog"
import { getUserChats } from "@/queries/chats"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [chats, cookieStore] = await Promise.all([getUserChats(), cookies()])
  const sidebarOpen = cookieStore.get("sidebar_state")?.value !== "false"

  return (
    <SidebarProvider defaultOpen={sidebarOpen}>
      <AppSidebar
        chatList={<ChatList />}
        chatSearch={<ChatSearchDialog chats={chats} />}
      />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
