import { Bell, Trash2 } from "lucide-react"
import type { NotificationDTO } from "../notificationInterface"

type Props = {
    notification: NotificationDTO
    onRead: (id: string) => void
    onClear: (id: string) => void
}

export default function NotificationItem({ notification, onRead, onClear }: Props) {
    const { id, title, message, isRead, createdAt } = notification

    return (
        <div
            onClick={() => !isRead && onRead(id)}
            className={`group relative flex gap-3 px-4 py-3 border-b border-blush-light/40 last:border-b-0 cursor-pointer transition-colors duration-200 ${
                isRead ? "bg-off-white" : "bg-blush-pale/40"
            } hover:bg-blush-pale/70`}
        >
            <div className="mt-0.5 shrink-0">
                <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                        isRead
                            ? "bg-gray-100 border-gray-200 text-gray-400"
                            : "bg-blush-pale border-blush-light text-blush-deep"
                    }`}
                >
                    <Bell size={14} strokeWidth={2} />
                </div>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <p className="text-[12px] font-semibold text-soft-black leading-tight truncate">
                        {title}
                    </p>
                    {!isRead && <span className="w-2 h-2 rounded-full bg-blush-deep mt-1 shrink-0" />}
                </div>
                <p className="text-xs font-dm-sans-light text-soft-black/70 leading-relaxed line-clamp-2 mt-0.5">
                    {message}
                </p>
                <p className="text-xxs text-soft-black/40 mt-1">{createdAt}</p>
            </div>

            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation()
                    onClear(id)
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 self-start text-soft-black/30 hover:text-blush-deep shrink-0"
                aria-label="Clear notification"
            >
                <Trash2 size={14} strokeWidth={2} />
            </button>
        </div>
    )
}