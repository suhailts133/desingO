export interface CreateNotificationDTO {
    recipientId: string;
    senderId: string;
    title: string;
    message: string;
    activeId: string;
}

export interface NotificationResponseDTO {
    id: string;
    senderId: string;
    title: string;
    message: string;
    activeId: string;
    isRead: boolean;
    createdAt: Date;
}