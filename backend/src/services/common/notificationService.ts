import type { CreateNotificationDTO, NotificationResponseDTO } from "../../DTO/socket/notificationDTO";
import { NotificationMapper } from "../../dtoMappers/common/notificationMapper";
import type { INotificationRepository } from "../../interfaces/socket/ISocketRepository";
import type { INotificationService } from "../../interfaces/socket/ISocketService";
import { RESPONSE_CODE } from "../../shared/enums/statusCode";
import { AppError } from "../../shared/errors/appError";
import { SOCKET_MESSAGES } from "../../shared/messages/socketMessage";
import { getIO } from "../../socket/ioInstance";

export class NotificationService implements INotificationService {
    constructor(private _notificationRepo: INotificationRepository) { }

    async notify(data: CreateNotificationDTO): Promise<NotificationResponseDTO> {
        const saved = await this._notificationRepo.createNotication(data);
        getIO().to(`user:${saved.recipientId}`).emit("new_notification", saved);
        return NotificationMapper.toDTO(saved);
    }

    async getUserNotifications(userId: string, page = 1, limit = 20) {
        const list = await this._notificationRepo.findByUser(userId, page, limit);
        return NotificationMapper.toDTOList(list);
    }

    async getUnreadCount(userId: string): Promise<number> {
        return this._notificationRepo.countUnread(userId);
    }

    async markAsRead(notificationId: string, userId: string): Promise<void> {
        const updated = await this._notificationRepo.markAsRead(notificationId, userId);
        if (!updated) {
            throw new AppError(SOCKET_MESSAGES.NOTIFICATION.NOT_FOUND, RESPONSE_CODE.NOT_FOUND);
        }
    }

    async markAllAsRead(userId: string): Promise<number> {
        return this._notificationRepo.markAllAsRead(userId);
    }

    async clearOne(notificationId: string, userId: string): Promise<void> {
        const deleted = await this._notificationRepo.deleteOne(notificationId, userId);
        if (!deleted) {
            throw new AppError(SOCKET_MESSAGES.NOTIFICATION.NOT_FOUND, RESPONSE_CODE.NOT_FOUND);
        }
    }

    async clearAll(userId: string): Promise<number> {
        return this._notificationRepo.deleteAll(userId);
    }
}