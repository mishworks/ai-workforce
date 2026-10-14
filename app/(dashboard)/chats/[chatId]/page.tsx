import { notFound } from "next/navigation"
import { getChat } from "@/queries"
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

  return (
    <div className="flex h-svh flex-col">
      <ChatHeader chat={chat} />
      <ChatInterface />
    </div>
  )
}
