import { chat, defaultStorage } from "@trigger.dev/sdk/ai";
import type { chatAgent } from "@/trigger/chat";

// Server-only helpers. Callers must check the user owns the chatId first.
export const startSession = chat.createStartSessionAction<typeof chatAgent>("my-chat");

// A paged read is served by the platform and is much faster than reading the whole snapshot.
export const loadTranscript = chat.createLoadTranscriptAction(defaultStorage, { limit: 100 });
