import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ChatAvatar } from "@/components/chat-avatar";
import { getUserChats } from "@/queries/chats";

export async function ChatList() {
  const chats = await getUserChats();

  if (chats.length === 0) return null;

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {chats.map((chat) => {
            const displayName = chat.name ?? chat.bot?.name ?? "Chat";
            const seed = chat.bot?.avatar ?? "default";
            const timeAgo = formatDistanceToNowStrict(chat.lastMessagedAt);

            return (
              <SidebarMenuItem key={chat.id}>
                <SidebarMenuButton render={<Link href={`/chats/${chat.id}`} />} className="h-auto items-center gap-3 py-2">
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
                      {chat.lastMessagePreview && (
                        <span className="truncate text-xs text-sidebar-foreground/50">
                          {chat.lastMessagePreview}
                        </span>
                      )}
                    </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
