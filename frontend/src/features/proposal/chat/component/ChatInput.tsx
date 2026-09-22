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
        <div className="px-4 py-3 border-t border-surface-border flex items-end gap-2 shrink-0">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isConnected ? "Type a message…" : "Connecting…"}
                disabled={!isConnected}
                rows={1}
                className="flex-1 resize-none rounded-2xl border border-surface-border bg-surface-hover px-4 py-2 text-sm text-text-primary placeholder:text-text-faint outline-none focus:border-accent transition-colors min-h-9.5 max-h-25 font-Jost-Regular leading-relaxed disabled:opacity-50"
            />
            <button
                onClick={handleSend}
                disabled={!input.trim() || !isConnected}
                className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-text-on-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
            >
                <Send className="w-4 h-4" />
            </button>
        </div>
    )
}