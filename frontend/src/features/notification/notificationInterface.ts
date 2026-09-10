export interface NotificationDTO {
    id: string
    title: string
    message: string
    type: string
    isRead: boolean
    activeId?: string
    senderId?: string
    createdAt: string
}

export interface NotificationListPayload {
    list: NotificationDTO[]
    unreadCount: number
}