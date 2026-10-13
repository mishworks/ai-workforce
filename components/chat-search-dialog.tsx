"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SearchIcon } from "lucide-react"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { ChatAvatar } from "@/components/chat-avatar"
import type { ChatListItem } from "@/queries/chats"

export function ChatSearchDialog({ chats }: { chats: ChatListItem[] }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-8 w-full items-center gap-2 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:rounded-md group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
      >
        <SearchIcon className="size-3.5 shrink-0 group-data-[collapsible=icon]:size-4" />
        <span className="flex-1 truncate text-left group-data-[collapsible=icon]:hidden">Search</span>
        <KbdGroup className="group-data-[collapsible=icon]:hidden">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search chats"
        description="Search your chats"
      >
        {open && (
          <Command>
            <CommandInput placeholder="Search chats..." />
            <CommandList>
              <CommandEmpty>No chats found.</CommandEmpty>
              <CommandGroup heading="Chats">
                {chats.map((chat) => {
                  const displayName = chat.name ?? chat.bot?.name ?? "Chat"
                  const seed = chat.bot?.avatar ?? "default"
                  return (
                    <CommandItem
                      key={chat.id}
                      value={displayName}
                      onSelect={() => {
                        setOpen(false)
                        router.push(`/chats/${chat.id}`)
                      }}
                    >
                      <ChatAvatar seed={seed} className="size-6 shrink-0 rounded-md" />
                      {displayName}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </CommandDialog>
    </>
  )
}
