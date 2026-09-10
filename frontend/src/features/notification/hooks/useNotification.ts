import { useCallback, useEffect, useState } from "react"

import type { NotificationDTO, NotificationListPayload } from "../notificationInterface"
import { useSocket } from "../../proposal/chat/useSocket"

const PAGE_SIZE = 10

export function useNotification(enabled: boolean) {
    const { socket, isConnected, error, setError } = useSocket(undefined, enabled)

    const [notifications, setNotifications] = useState<NotificationDTO[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(false)
    const [isLoadingMore, setIsLoadingMore] = useState(false)

    useEffect(() => {
        if (!socket) return

        const handleList = ({ list, unreadCount: count }: NotificationListPayload) => {
            setIsLoadingMore(false)
            setNotifications((prev) => {
                if (page === 1) return list
                const existingIds = new Set(prev.map((n) => n.id))
                return [...prev, ...list.filter((n) => !existingIds.has(n.id))]
            })
            setUnreadCount(count)
            setHasMore(list.length === PAGE_SIZE)
        }

        const handleUpdated = ({ notificationId, isRead }: { notificationId: string; isRead: boolean }) => {
            setNotifications((prev) =>
                prev.map((n) => (n.id === notificationId ? { ...n, isRead } : n))
            )
            if (isRead) setUnreadCount((prev) => Math.max(0, prev - 1))
        }

        const handleAllRead = () => {
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
            setUnreadCount(0)
        }
        const handleNewNotification = (newNotification: NotificationDTO) => {
            setNotifications((prev) => {
                if (prev.some((n) => n.id === newNotification.id)) return prev;
                return [newNotification, ...prev];
            });

            setUnreadCount((prev) => prev + 1);
        }
        const handleRemoved = ({ notificationId }: { notificationId: string }) => {
            setNotifications((prev) => {
                const removed = prev.find((n) => n.id === notificationId)
                if (removed && !removed.isRead) {
                    setUnreadCount((count) => Math.max(0, count - 1))
                }
                return prev.filter((n) => n.id !== notificationId)
            })
        }

        const handleCleared = () => {
            setNotifications([])
            setUnreadCount(0)
            setHasMore(false)
        }

        const handleChatError = ({ message }: { message: string }) => {
            setError(message)
            setIsLoadingMore(false)
        }

        socket.on("notification_list", handleList)
        socket.on("notification_updated", handleUpdated)
        socket.on("new_notification", handleNewNotification)
        socket.on("all_notifications_read", handleAllRead)
        socket.on("notification_removed", handleRemoved)
        socket.on("notifications_cleared", handleCleared)
        socket.on("chat_error", handleChatError)

        socket.emit("fetch_notifications", { page: 1 })

        return () => {
            socket.off("notification_list", handleList)
            socket.off("notification_updated", handleUpdated)
            socket.off("new_notification", handleNewNotification)
            socket.off("all_notifications_read", handleAllRead)
            socket.off("notification_removed", handleRemoved)
            socket.off("notifications_cleared", handleCleared)
            socket.off("chat_error", handleChatError)
        }
    }, [socket, page, setError])

    const markAsRead = useCallback(
        (notificationId: string) => socket?.emit("mark_notification_read", { notificationId }),
        [socket]
    )

    const markAllAsRead = useCallback(() => {
        socket?.emit("mark_all_notifications_read")
    }, [socket])

    const clearOne = useCallback(
        (notificationId: string) => socket?.emit("clear_notification", { notificationId }),
        [socket]
    )

    const clearAll = useCallback(() => {
        socket?.emit("clear_all_notifications")
    }, [socket])

    const loadMore = useCallback(() => {
        if (!socket || isLoadingMore || !hasMore) return
        setIsLoadingMore(true)
        setPage((prev) => {
            const next = prev + 1
            socket.emit("fetch_notifications", { page: next })
            return next
        })
    }, [socket, isLoadingMore, hasMore])

    return {
        notifications,
        unreadCount,
        isConnected,
        error,
        hasMore,
        isLoadingMore,
        markAsRead,
        markAllAsRead,
        clearOne,
        clearAll,
        loadMore,
    }
}