import { auth } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { chats } from "@/lib/schema";

export type ChatListItem = {
  id: string;
  name: string | null;
  lastMessagePreview: string | null;
  lastMessagedAt: Date;
  bot: { avatar: string; name: string } | null;
};

export type Chat = {
  id: string;
  name: string | null;
  kind: "direct" | "group";
  bot: { id: string; name: string; avatar: string; job: string; instructions: string | null } | null;
};

export async function getChat(chatId: string): Promise<Chat | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const row = await db.query.chats.findFirst({
    where: and(eq(chats.id, chatId), eq(chats.userId, userId)),
    with: {
      members: {
        with: { bot: true },
        limit: 1,
      },
    },
  });

  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    kind: row.kind,
    bot: row.members[0]?.bot
      ? {
          id: row.members[0].bot.id,
          name: row.members[0].bot.name,
          avatar: row.members[0].bot.avatar,
          job: row.members[0].bot.job,
          instructions: row.members[0].bot.instructions,
        }
      : null,
  };
}

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
