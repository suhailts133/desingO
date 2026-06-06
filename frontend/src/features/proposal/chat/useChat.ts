import { useEffect, useState } from "react"
import { useSocket } from "./useSocket"
import type { Message } from "../proposalInterface"

export function useChat(activeJobId: string, enabled: boolean) {
    const { socket, isConnected, error, setError } = useSocket(activeJobId, enabled)
    
    const [messages, setMessages] = useState<Message[]>([])
    const [hasMore, setHasMore] = useState(false)
    const [isLoadingMore, setIsLoadingMore] = useState(false)

    useEffect(() => {
        if (!socket) return

        const handleHistory = (history: Message[]) => {
            setMessages(history)
            setHasMore(history.length === 10)
        }

        const handleHistoryChunk = (chunk: Message[]) => {
            setIsLoadingMore(false)
            if (chunk.length === 0) {
                setHasMore(false)
                return
            }
            setMessages((prev) => {
                const existingIds = new Set(prev.map((m) => m.id))
                const newChunk = chunk.filter((m) => !existingIds.has(m.id))
                return [...newChunk, ...prev]
            })
            setHasMore(chunk.length === 10)
        }

        const handleNewMessage = (message: Message) => {
            setMessages((prev) => {
                if (prev.some((m) => m.id === message.id)) return prev
                return [...prev, message]
            })
        }

        const handleChatError = ({ message }: { message: string }) => {
            setError(message)
            setIsLoadingMore(false)
        }

        socket.on("message_history", handleHistory)
        socket.on("history_chunk", handleHistoryChunk)
        socket.on("new_message", handleNewMessage)
        socket.on("chat_error", handleChatError)

        return () => {
            socket.off("message_history", handleHistory)
            socket.off("history_chunk", handleHistoryChunk)
            socket.off("new_message", handleNewMessage)
            socket.off("chat_error", handleChatError)
            setMessages([])
            setHasMore(false)
            setIsLoadingMore(false)
        }
    }, [socket, setError])

    const sendMessage = (content: string) => {
        if (!socket || !content.trim()) return
        socket.emit("send_message", { activeJobId, content })
    }

    const loadMore = () => {
        if (!socket || messages.length === 0 || isLoadingMore || !hasMore) return
        setIsLoadingMore(true)
        socket.emit("fetch_history", {
            activeJobId,
            before: messages[0].id,
        })
    }

    return { 
        messages, 
        sendMessage, 
        isConnected, 
        error, 
        hasMore, 
        isLoadingMore, 
        loadMore 
    }
}