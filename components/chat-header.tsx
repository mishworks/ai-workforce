"use client"

import { useState } from "react"
import { MonitorIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatAvatar } from "@/components/chat-avatar"
import { BotEditDialog } from "@/components/bot-edit-dialog"
import type { Chat } from "@/queries"

interface ChatHeaderProps {
  chat: Chat
}

export function ChatHeader({ chat }: ChatHeaderProps) {
  const [editOpen, setEditOpen] = useState(false)
  const displayName = chat.name ?? chat.bot?.name ?? "Chat"
  const subtitle = chat.bot?.job

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <div className="flex flex-1 items-center gap-3 min-w-0">
        {chat.bot && (
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="shrink-0 rounded-lg ring-offset-background transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ChatAvatar seed={chat.bot.avatar} className="size-8 rounded-lg" />
          </button>
        )}
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-semibold leading-tight">{displayName}</span>
          {subtitle && (
            <span className="truncate text-xs text-muted-foreground leading-tight">{subtitle}</span>
          )}
        </div>
      </div>

      {chat.bot && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex shrink-0"
            onClick={() => setEditOpen(true)}
          >
            <MonitorIcon className="size-4" />
          </Button>
          <BotEditDialog
            bot={chat.bot}
            open={editOpen}
            onOpenChange={setEditOpen}
          />
        </>
      )}
    </header>
  )
}
