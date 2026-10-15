import { notFound } from "next/navigation"
import { getChat } from "@/queries"
import { loadTranscript, startSession } from "@/lib/chat-agent"
import { ChatHeader } from "@/components/chat-header"
import { ChatInterface } from "@/components/chat-interface"

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>
}) {
  const { chatId } = await params
  const chat = await getChat(chatId)

  if (!chat) notFound()

  // Starting the session here means the first send doesn't wait on it, and the
  // transport knows the session so it can resume a reply still streaming.
  const [{ publicAccessToken }, transcript] = await Promise.all([
    startSession({ chatId: chat.id }),
    loadTranscript({ chatId: chat.id }),
  ])

  return (
    <div className="flex h-svh flex-col">
      <ChatHeader chat={chat} />
      <ChatInterface
        key={chat.id}
        chatId={chat.id}
        initialMessages={transcript.messages}
        session={{
          publicAccessToken,
          lastEventId: transcript.cursors?.lastOutEventId,
        }}
      />
    </div>
  )
}
