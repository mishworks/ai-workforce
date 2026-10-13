import { formatDistanceToNowStrict } from "date-fns";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ChatListItem } from "@/components/chat-list-item";
import { getUserChats } from "@/queries/chats";

export async function ChatList() {
  const chats = await getUserChats();

  if (chats.length === 0) return null;

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu className="gap-0.5 group-data-[collapsible=icon]:gap-2">
          {chats.map((chat) => {
            const displayName = chat.name ?? chat.bot?.name ?? "Chat";
            const seed = chat.bot?.avatar ?? "default";
            const timeAgo = formatDistanceToNowStrict(chat.lastMessagedAt);

            return (
              <SidebarMenuItem key={chat.id}>
                <ChatListItem
                  id={chat.id}
                  displayName={displayName}
                  seed={seed}
                  timeAgo={timeAgo}
                  lastMessagePreview={chat.lastMessagePreview}
                />
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
