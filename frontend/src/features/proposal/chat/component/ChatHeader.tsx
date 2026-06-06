import { X } from "lucide-react"

interface ChatHeaderProps {
    otherPersonName: string
    role: string
    initials: string
    isConnected: boolean
    onClose: () => void
}

export function ChatHeader({ otherPersonName, role, initials, isConnected, onClose }: ChatHeaderProps) {
    return (
        <div className="flex items-center justify-between px-4 py-3 border-b border-blush-light/40 shrink-0">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center text-xs font-Jost-Semibold text-green-700 shrink-0">
                    {initials}
                </div>
                <div>
                    <p className="text-sm font-Jost-Semibold text-soft-black leading-tight">
                        {otherPersonName}
                    </p>
                    <p className="text-xs text-soft-black/40">
                        {role === "Customer" ? "Interior Designer" : "Client"}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${isConnected ? "bg-green-400" : "bg-gray-300"}`} />
                    <span className="text-xxs text-soft-black/30">
                        {isConnected ? "Connected" : "Connecting…"}
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="w-7 h-7 rounded-lg border border-blush-light/50 flex items-center justify-center text-soft-black/40 hover:text-soft-black hover:bg-off-white transition-all"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}