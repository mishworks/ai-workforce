"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ChatAvatar } from "@/components/chat-avatar"

interface ChatListItemProps {
  id: string
  displayName: string
  seed: string
  timeAgo: string
  lastMessagePreview?: string | null
}

export function ChatListItem({ id, displayName, seed, timeAgo, lastMessagePreview }: ChatListItemProps) {
  const { state, isMobile } = useSidebar()
  const isIconMode = state === "collapsed" && !isMobile
  const pathname = usePathname()
  const isActive = pathname === `/chats/${id}`

  const button = (
    <SidebarMenuButton render={<Link href={`/chats/${id}`} />} size="lg" isActive={isActive} className="h-auto items-center gap-3 py-2">
      <ChatAvatar seed={seed} className="size-8 shrink-0 rounded-lg" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-medium leading-none text-sidebar-foreground">
            {displayName}
          </span>
          <span className="shrink-0 text-xs text-sidebar-foreground/50">
            {timeAgo}
          </span>
        </div>
        {lastMessagePreview && (
          <span className="truncate text-xs text-sidebar-foreground/50">
            {lastMessagePreview}
          </span>
        )}
      </div>
    </SidebarMenuButton>
  )

  if (!isIconMode) return button

  return (
    <Tooltip>
      <TooltipTrigger render={button} />
      <TooltipContent side="right">
        {displayName}
      </TooltipContent>
    </Tooltip>
  )
}
