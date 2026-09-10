import type { NotificationType } from "../../interfaces/socket/ISocket";

export interface CreateNotificationDTO {
    recipientId: string;
    senderId: string;
    title: string;
    message: string;
    activeId?: string;
    type: NotificationType
}

export interface NotificationResponseDTO {
    id: string;
    senderId: string;
    type: NotificationType
    title: string;
    message: string;
    activeId?: string;
    isRead: boolean;
    createdAt: string;
}