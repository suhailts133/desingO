import { useEffect, useRef } from "react"
import { Loader2, MessageCircle } from "lucide-react"
import { formatTime, groupByDate, formatDateLabel } from "../chatUtils"
import type { Message } from "../../proposalInterface"

interface MessageListProps {
    messages: Message[]
    currentUserId: string
    otherPersonInitials: string
    error: string | null
    hasMore: boolean
    isLoadingMore: boolean
    onLoadMore: () => void
}

export function MessageList({ messages, currentUserId, otherPersonInitials, error, hasMore, isLoadingMore, onLoadMore}: MessageListProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const topSentinelRef = useRef<HTMLDivElement>(null)
    const prevScrollHeightRef = useRef<number>(0)
    const isFetchingRef = useRef<boolean>(false)

    const grouped = groupByDate(messages)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        if (isFetchingRef.current) {
            container.scrollTop = container.scrollHeight - prevScrollHeightRef.current
            isFetchingRef.current = false
        } else {
            container.scrollTop = container.scrollHeight
        }
    }, [messages])

    useEffect(() => {
        const sentinel = topSentinelRef.current
        if (!sentinel) return

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && hasMore && !isLoadingMore) {
                if (containerRef.current) {
                    prevScrollHeightRef.current = containerRef.current.scrollHeight
                    isFetchingRef.current = true
                }
                onLoadMore()
            }
        }, { root: containerRef.current, threshold: 1.0 })

        observer.observe(sentinel)
        return () => observer.disconnect()
    }, [hasMore, isLoadingMore, onLoadMore])

    return (
        <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1">
            <div ref={topSentinelRef} className="h-1 w-full" />

            {isLoadingMore && (
                <div className="flex items-center justify-center py-2">
                    <Loader2 className="w-3 h-3 animate-spin text-soft-black/30" />
                </div>
            )}

            {error && <p className="text-xs text-center text-red-500 py-2">{error}</p>}

            {messages.length === 0 && !error && (
                <div className="flex-1 flex flex-col items-center justify-center gap-2 mt-16">
                    <MessageCircle className="w-8 h-8 text-soft-black/20" />
                    <p className="text-xs text-soft-black/30">No messages yet. Say hello!</p>
                </div>
            )}

            {Object.entries(grouped).map(([dateKey, dayMessages]) => (
                <div key={dateKey} className="flex flex-col gap-2">
                    {/* Date Divider */}
                    <div className="flex items-center gap-2 my-3">
                        <div className="flex-1 h-px bg-blush-light/40" />
                        <span className="text-xxs text-soft-black/30 px-2">{formatDateLabel(dateKey)}</span>
                        <div className="flex-1 h-px bg-blush-light/40" />
                    </div>

                    {dayMessages.map((msg, index) => {
                        const isMine = msg.senderId === currentUserId
                        const prevMsg = dayMessages[index - 1]
                        const isSameAsPrev = prevMsg?.senderId === msg.senderId
                        const showAvatar = !isMine && !isSameAsPrev

                        return (
                            <div key={msg.id} className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : ""} ${isSameAsPrev ? "mt-0.5" : "mt-2"}`}>
                                {!isMine && (
                                    <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xxs font-Jost-Semibold ${showAvatar ? "bg-green-50 text-green-700" : "opacity-0"}`}>
                                        {otherPersonInitials}
                                    </div>
                                )}
                                <div className={`flex flex-col gap-0.5 ${isMine ? "items-end" : "items-start"}`}>
                                    <div className={`max-w-60 px-3 py-2 text-sm leading-relaxed wrap-break-word ${isMine ? "bg-soft-black/90 text-white rounded-2xl rounded-br-sm" : "bg-off-white text-soft-black rounded-2xl rounded-bl-sm"}`}>
                                        {msg.content}
                                    </div>
                                    <span className="text-xxs text-soft-black/30 px-1">{formatTime(msg.createdAt)}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ))}
        </div>
    )
}