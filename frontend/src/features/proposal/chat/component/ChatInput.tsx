import { useState } from "react"
import { Send } from "lucide-react"

interface ChatInputProps {
    isConnected: boolean
    onSendMessage: (message: string) => void
}

export function ChatInput({ isConnected, onSendMessage }: ChatInputProps) {
    const [input, setInput] = useState("")

    const handleSend = () => {
        if (!input.trim() || !isConnected) return
        onSendMessage(input.trim())
        setInput("")
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="px-4 py-3 border-t border-blush-light/40 flex items-end gap-2 shrink-0">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isConnected ? "Type a message…" : "Connecting…"}
                disabled={!isConnected}
                rows={1}
                className="flex-1 resize-none rounded-2xl border border-blush-light/50 bg-off-white px-4 py-2 text-sm text-soft-black placeholder:text-soft-black/30 outline-none focus:border-green-300 transition-colors min-h-9.5 max-h-25 font-Jost-Regular leading-relaxed disabled:opacity-50"
            />
            <button
                onClick={handleSend}
                disabled={!input.trim() || !isConnected}
                className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center text-white hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
            >
                <Send className="w-4 h-4" />
            </button>
        </div>
    )
}