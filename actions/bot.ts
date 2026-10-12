"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { bots, insertBotSchema } from "@/lib/schema";

export async function createBot(
  data: z.infer<typeof insertBotSchema>
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth.protect();

  try {
    await db.insert(bots).values({
      ...data,
      id: crypto.randomUUID(),
      userId,
    });
    return { success: true };
  } catch {
    return { success: false, error: "Failed to create bot." };
  }
}
