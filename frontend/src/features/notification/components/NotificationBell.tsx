import { Bell, CheckCheck, Loader2, Trash2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import NotificationItem from "./NotificationItem"
import { useNotification } from "../hooks/useNotification"

export default function NotificationBell() {
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
                className="relative flex items-center justify-center text-text-primary hover:text-accent transition-colors duration-200"
                aria-label="Notifications"
            >
                <Bell size={16} className="sm:hidden" />
                <Bell size={18} className="hidden sm:block" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-accent text-text-on-accent text-xxs font-semibold flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 max-h-112 bg-surface text-text-primary rounded-xl border border-surface-border overflow-hidden flex flex-col z-50 font-normal">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border bg-surface-hover">
                        <h3 className="text-sm font-semibold text-text-primary">Notifications</h3>
                        <div className="flex items-center gap-3">
                            {unreadCount > 0 && (
                                <button
                                    type="button"
                                    onClick={markAllAsRead}
                                    className="flex items-center gap-1 text-xxs font-semibold uppercase tracking-wide text-accent hover:text-accent-hover transition-colors duration-200"
                                >
                                    <CheckCheck size={12} strokeWidth={2} />
                                    Mark all read
                                </button>
                            )}
                            {notifications.length > 0 && (
                                <button
                                    type="button"
                                    onClick={clearAll}
                                    className="flex items-center gap-1 text-xxs font-semibold uppercase tracking-wide text-text-faint hover:text-error transition-colors duration-200"
                                >
                                    <Trash2 size={12} strokeWidth={2} />
                                    Clear all
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="overflow-y-auto flex-1">
                        {error && <p className="px-4 py-6 text-xs text-center text-error">{error}</p>}

                        {!error && notifications.length === 0 && (
                            <p className="px-4 py-8 text-xs text-center text-text-faint">
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
                                className="w-full py-3 flex items-center justify-center gap-2 text-xxs font-semibold uppercase tracking-wide text-accent hover:bg-surface-hover transition-colors duration-200 disabled:opacity-50"
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