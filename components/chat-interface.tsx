"use client"

import { useEffect, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { generateId, type UIMessage } from "ai"
import type { ChatSessionPersistedState } from "@trigger.dev/sdk/chat"
import { useTriggerChatTransport } from "@trigger.dev/sdk/chat/react"
import type { chatAgent } from "@/trigger/chat"
import { mintChatAccessToken, startChatSession } from "@/actions/chat"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import { MessageSquare } from "lucide-react"
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from "@/components/ui/message-scroller"
import { Message, MessageContent } from "@/components/ui/message"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  PromptInput,
  type PromptInputMessage,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputBody,
  PromptInputFooter,
} from "@/components/ai-elements/prompt-input"

// The agent saves a turn only once it starts answering, so a refresh right after
// sending can load a transcript without that message. The last delivered message
// is kept here until a loaded transcript contains it.
const pendingKey = (chatId: string) => `chat-pending:${chatId}`

function readPending(chatId: string): UIMessage | undefined {
  try {
    const raw = sessionStorage.getItem(pendingKey(chatId))
    return raw ? JSON.parse(raw) : undefined
  } catch {
    return undefined
  }
}

function writePending(chatId: string, message?: UIMessage) {
  try {
    if (message)
      sessionStorage.setItem(pendingKey(chatId), JSON.stringify(message))
    else sessionStorage.removeItem(pendingKey(chatId))
  } catch {}
}

export function ChatInterface({
  chatId,
  initialMessages,
  session,
}: {
  chatId: string
  initialMessages: UIMessage[]
  session: ChatSessionPersistedState
}) {
  const lastSent = useRef<UIMessage | undefined>(undefined)
  const transport = useTriggerChatTransport<typeof chatAgent>({
    task: "my-chat",
    accessToken: ({ chatId }) => mintChatAccessToken(chatId),
    startSession: ({ chatId, clientData }) =>
      startChatSession({ chatId, clientData }),
    sessions: { [chatId]: session },
    // Only record a message once it is durably in the session, so the agent will answer it.
    onEvent: (event) => {
      if (event.type === "message-sent" && event.source === "submit-message") {
        writePending(chatId, lastSent.current)
      }
    },
  })
  const [input, setInput] = useState("")
  const { messages, sendMessage, setMessages, resumeStream, status } = useChat({
    id: chatId,
    messages: initialMessages,
    transport,
    // Reconnect to a reply that was still streaming when the page reloaded.
    resume: initialMessages.length > 0,
  })

  useEffect(() => {
    const pending = readPending(chatId)
    if (!pending) return
    if (initialMessages.some((m) => m.id === pending.id)) {
      writePending(chatId)
      return
    }
    // Effects run twice in dev (Strict Mode), so don't append it again.
    setMessages((prev) =>
      prev.some((m) => m.id === pending.id) ? prev : [...prev, pending]
    )
    // With an empty transcript `resume` is off, so reconnect for the pending reply here.
    if (initialMessages.length === 0) resumeStream()
  }, [chatId, initialMessages, setMessages, resumeStream])

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text.trim()) return
    const userMessage: UIMessage = {
      id: generateId(),
      role: "user",
      parts: [{ type: "text", text: message.text }],
    }
    lastSent.current = userMessage
    sendMessage(userMessage)
    setInput("")
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 p-4">
      <MessageScrollerProvider autoScroll>
        <MessageScroller>
          <MessageScrollerViewport>
            <MessageScrollerContent>
              {messages.length === 0 && (
                <Empty className="border-none">
                  <EmptyHeader>
                    <EmptyMedia>
                      <MessageSquare className="size-8 text-muted-foreground" />
                    </EmptyMedia>
                    <EmptyTitle>Start a conversation</EmptyTitle>
                    <EmptyDescription>
                      Type a message below to begin chatting
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
              {messages.map((message) => {
                const isUser = message.role === "user"
                return (
                  <MessageScrollerItem
                    key={message.id}
                    messageId={message.id}
                    scrollAnchor={isUser}
                  >
                    <Message align={isUser ? "end" : "start"}>
                      <MessageContent>
                        <Bubble
                          variant={isUser ? "default" : "muted"}
                          align={isUser ? "end" : "start"}
                        >
                          {message.parts.map((part, i) => {
                            if (part.type !== "text") return null
                            return (
                              <BubbleContent key={`${message.id}-${i}`}>
                                {part.text}
                              </BubbleContent>
                            )
                          })}
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                )
              })}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>

      <PromptInput
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-2xl shrink-0"
      >
        <PromptInputBody>
          <PromptInputTextarea
            value={input}
            placeholder="Say something..."
            onChange={(e) => setInput(e.currentTarget.value)}
            className="min-h-10"
          />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputSubmit
            status={status}
            disabled={!input.trim()}
            className="ml-auto"
          />
        </PromptInputFooter>
      </PromptInput>
    </div>
  )
}
