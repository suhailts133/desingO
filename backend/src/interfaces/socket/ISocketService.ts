import type { MessageResponseDTO, saveMessageResponseDTO, SendMessageRequestDTO } from "../../DTO/socket/chatDTO";
import type { CreateNotificationDTO, NotificationResponseDTO } from "../../DTO/socket/notificationDTO";

export interface IChatService {
    getHistory(activeJobId: string, userId: string, before?: string): Promise<MessageResponseDTO[]>
    saveMessage(data: SendMessageRequestDTO): Promise<saveMessageResponseDTO>
}


export interface INotificationService {
    notify(data: CreateNotificationDTO): Promise<NotificationResponseDTO>;
    getUserNotifications(userId: string, page?: number, limit?: number): Promise<NotificationResponseDTO[]>;
    getUnreadCount(userId: string): Promise<number>;
    markAsRead(notificationId: string, userId: string): Promise<void>;
    markAllAsRead(userId: string): Promise<number>;
    clearOne(notificationId: string, userId: string): Promise<void>;
    clearAll(userId: string): Promise<number>;
}