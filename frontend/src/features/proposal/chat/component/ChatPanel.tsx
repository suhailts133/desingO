import { useEffect } from "react"
import { useChat } from "../useChat"
import { useDecodeAccessToken } from "../../../../helpers/decodeAccessToken"
import { getInitials } from "../chatUtils"
import { ChatHeader } from "./ChatHeader"
import { ChatInput } from "./ChatInput"
import { MessageList } from "./MessageList"


interface ChatPanelProps {
    isOpen: boolean
    onClose: () => void
    activeJobId: string
    otherPersonName: string
    role: string
}

export default function ChatPanel({ isOpen, onClose, activeJobId, otherPersonName, role}: ChatPanelProps) {
    const { id } = useDecodeAccessToken()
    const { messages, sendMessage, isConnected, error, hasMore, isLoadingMore, loadMore } =
        useChat(activeJobId, isOpen)

    const initials = getInitials(otherPersonName)

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [onClose])

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-black/20 transition-opacity duration-200
                    ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
            />

            {/* Slide-in panel */}
            <div
                className={`fixed top-0 right-0 z-50 h-full w-95 bg-white
                    border-l border-blush-light/40 flex flex-col
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <ChatHeader
                    otherPersonName={otherPersonName}
                    role={role}
                    initials={initials}
                    isConnected={isConnected}
                    onClose={onClose}
                />

                <MessageList
                    messages={messages}
                    currentUserId={id!}
                    otherPersonInitials={initials}
                    error={error}
                    hasMore={hasMore}
                    isLoadingMore={isLoadingMore}
                    onLoadMore={loadMore}
                />

                <ChatInput
                    isConnected={isConnected}
                    onSendMessage={sendMessage}
                />
            </div>
        </>
    )
}