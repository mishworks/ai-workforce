"use server";

import { auth } from "@trigger.dev/sdk";
import type { ChatStartSessionParams } from "@trigger.dev/sdk/ai";
import { getChat } from "@/queries";
import { startSession } from "@/lib/chat-agent";
import type { chatAgent } from "@/trigger/chat";

// chatId comes from the browser, so every action checks the signed-in user owns it.
async function assertChatOwner(chatId: string) {
  const chat = await getChat(chatId);
  if (!chat) throw new Error("Chat not found");
}

export async function startChatSession({
  chatId,
  clientData,
}: ChatStartSessionParams<typeof chatAgent>) {
  await assertChatOwner(chatId);
  return startSession({ chatId, clientData });
}

export async function mintChatAccessToken(chatId: string) {
  await assertChatOwner(chatId);
  return auth.createPublicToken({
    scopes: { read: { sessions: chatId }, write: { sessions: chatId } },
    expirationTime: "1h",
  });
}
