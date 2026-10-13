import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { chats } from "@/lib/schema";

export type ChatListItem = {
  id: string;
  name: string | null;
  lastMessagePreview: string | null;
  lastMessagedAt: Date;
  bot: { avatar: string; name: string } | null;
};

export async function getUserChats(): Promise<ChatListItem[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const rows = await db.query.chats.findMany({
    where: eq(chats.userId, userId),
    orderBy: desc(chats.lastMessagedAt),
    with: {
      members: {
        with: { bot: true },
        limit: 1,
      },
    },
  });

  return rows.map((chat) => ({
    id: chat.id,
    name: chat.name,
    lastMessagePreview: chat.lastMessagePreview,
    lastMessagedAt: chat.lastMessagedAt,
    bot: chat.members[0]?.bot ?? null,
  }));
}
