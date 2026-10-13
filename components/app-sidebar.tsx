"use client"

import { useState, useRef } from "react"
import { UserButton } from "@clerk/nextjs"
import { PlusIcon, PlusCircleIcon, UsersIcon } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { BotDialog } from "@/components/bot-dialog"

export function AppSidebar({ chatList }: { chatList?: React.ReactNode }) {
  const [botDialogOpen, setBotDialogOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setDropdownOpen(false), 150)
  }

  function cancelClose() {
    clearTimeout(closeTimer.current)
  }

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row items-center justify-end px-3 py-2">
        <div
          onMouseEnter={() => { cancelClose(); setDropdownOpen(true) }}
          onMouseLeave={scheduleClose}
        >
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger
              render={
                <button className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <PlusIcon className="size-4" />
                </button>
              }
            />
            <DropdownMenuContent
              side="bottom"
              align="end"
              className="w-44"
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
            >
              <DropdownMenuItem onClick={() => setBotDialogOpen(true)}>
                <PlusCircleIcon />
                Create new bot
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UsersIcon />
                Create group chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <BotDialog open={botDialogOpen} onOpenChange={setBotDialogOpen} />
      </SidebarHeader>
      <SidebarContent>{chatList}</SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="sidebar-user-btn w-full px-0">
              <UserButton showName />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
