"use client"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
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

export function ChatInterface() {
  const [input, setInput] = useState("")
  const { messages, sendMessage, status } = useChat()

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text.trim()) return
    sendMessage({ text: message.text })
    setInput("")
  }

  return (
    <div className="flex flex-1 flex-col min-h-0 p-4 gap-4">
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
        className="w-full max-w-2xl mx-auto shrink-0"
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
