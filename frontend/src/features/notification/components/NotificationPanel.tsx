import { Bell, CheckCheck, Loader2, Trash2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useNotification } from "../hooks/useNotification"
import NotificationItem from "./NotificationItem"

export default function NotificationPanel() {
    const [isOpen, setIsOpen] = useState(false)
    const panelRef = useRef<HTMLDivElement>(null)

    const { notifications, unreadCount, error, hasMore, isLoadingMore, markAsRead, markAllAsRead, clearOne, clearAll, loadMore, } = useNotification(true)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={panelRef}>
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="relative w-9 h-9 rounded-full bg-off-white border border-blush-light/40 flex items-center justify-center hover:shadow-md transition-shadow duration-200"
                aria-label="Notifications"
            >
                <Bell size={16} className="text-soft-black/70" strokeWidth={2} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-blush-deep text-off-white text-xxs font-semibold flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 max-h-112 bg-off-white rounded-xl border border-blush-light/40 shadow-2xl overflow-hidden flex flex-col z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-blush-light/40">
                        <h3 className="text-sm font-semibold text-soft-black">Notifications</h3>
                        <div className="flex items-center gap-3">
                            {unreadCount > 0 && (
                                <button
                                    type="button"
                                    onClick={markAllAsRead}
                                    className="flex items-center gap-1 text-xxs font-semibold uppercase tracking-wide text-blush-deep hover:text-blush-deep/70 transition-colors duration-200"
                                >
                                    <CheckCheck size={12} strokeWidth={2} />
                                    Mark all read
                                </button>
                            )}
                            {notifications.length > 0 && (
                                <button
                                    type="button"
                                    onClick={clearAll}
                                    className="flex items-center gap-1 text-xxs font-semibold uppercase tracking-wide text-soft-black/40 hover:text-blush-deep transition-colors duration-200"
                                >
                                    <Trash2 size={12} strokeWidth={2} />
                                    Clear all
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="overflow-y-auto flex-1">
                        {error && <p className="px-4 py-6 text-xs text-center text-soft-black/50">{error}</p>}

                        {!error && notifications.length === 0 && (
                            <p className="px-4 py-8 text-xs text-center text-soft-black/40">
                                No notifications yet
                            </p>
                        )}

                        {notifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onRead={markAsRead}
                                onClear={clearOne}
                            />
                        ))}

                        {hasMore && (
                            <button
                                type="button"
                                onClick={loadMore}
                                disabled={isLoadingMore}
                                className="w-full py-3 flex items-center justify-center gap-2 text-xxs font-semibold uppercase tracking-wide text-blush-deep hover:bg-blush-pale/40 transition-colors duration-200 disabled:opacity-50"
                            >
                                {isLoadingMore && <Loader2 size={12} className="animate-spin" />}
                                {isLoadingMore ? "Loading" : "Load more"}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}