"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { bots, chats, chatMembers, insertBotSchema } from "@/lib/schema";

export async function createBot(
  data: z.infer<typeof insertBotSchema>
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth.protect();

  const botId = crypto.randomUUID();
  const chatId = crypto.randomUUID();

  try {
    await db.batch([
      db.insert(bots).values({ ...data, id: botId, userId }),
      db.insert(chats).values({ id: chatId, userId, kind: "direct" }),
      db.insert(chatMembers).values({ chatId, botId }),
    ]);
    revalidatePath("/", "layout");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to create bot." };
  }
}
