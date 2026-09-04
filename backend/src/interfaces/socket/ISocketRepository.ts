import type { CreateMessageDTO } from "../../DTO/socket/chatDTO";
import type { CreateNotificationDTO } from "../../DTO/socket/notificationDTO";
import type { IMessage, INotification } from "./ISocket";


export interface INotificationRepository {
    createNotication(data: CreateNotificationDTO): Promise<INotification>;
    findByUser(userId: string, page: number, limit: number): Promise<INotification[]>;
    countUnread(userId: string): Promise<number>;
    markAsRead(notificationId: string, userId: string): Promise<boolean>;
    markAllAsRead(userId: string): Promise<number>;   
    deleteOne(notificationId: string, userId: string): Promise<boolean>;
    deleteAll(userId: string): Promise<number>;
}

export interface IMessageRepository {
    createMessage(data: CreateMessageDTO): Promise<IMessage>;
    findByActiveJob(activeJobId: string, before?: string): Promise<IMessage[]>
}

