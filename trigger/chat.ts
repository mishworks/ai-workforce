import { chat } from "@trigger.dev/sdk/ai";
import { openai } from "@ai-sdk/openai";

// History is persisted per chatId by the default transcript storage.
// A chat's session is pinned to this id when created, so renaming it orphans existing chats.
export const chatAgent = chat.agent({
  id: "my-chat",
  run: async ({ messages, signal, streamText }) =>
    streamText({
      model: openai("gpt-6-luna"),
      messages,
      abortSignal: signal,
    }),
});
