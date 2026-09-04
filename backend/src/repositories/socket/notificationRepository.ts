import mongoose from "mongoose";
import type { CreateNotificationDTO } from "../../DTO/socket/notificationDTO";
import type { INotification } from "../../interfaces/socket/ISocket";
import type { INotificationRepository } from "../../interfaces/socket/ISocketRepository";
import { NotificationModel } from "../../models/socket/notificationModel";
import { BaseRepository } from "../baseRepository";

export class NotificationRepository extends BaseRepository<INotification> implements INotificationRepository {

    constructor() {
        super(NotificationModel)
    }

    async createNotication(data: CreateNotificationDTO): Promise<INotification> {
        return this.create({
            title: data.title,
            message: data.message,
            senderId: new mongoose.Types.ObjectId(data.senderId),
            recipientId: new mongoose.Types.ObjectId(data.recipientId),
            activeId: new mongoose.Types.ObjectId(data.activeId)
        });
    }

    async findByUser(userId: string, page = 1, limit = 20): Promise<INotification[]> {
        const skip = (page - 1) * limit;

        return this.find(
            { recipientId: userId },
            {
                sort: { createdAt: -1 },
                skip: skip,
                limit: limit
            }
        );
    }


    async countUnread(userId: string): Promise<number> {
        return this._model.countDocuments({ recipientId: userId, isRead: false });
    }

    async markAsRead(notificationId: string, userId: string): Promise<boolean> {
        const result = await this.updateOne(
            { _id: notificationId, recipientId: userId },
            { $set: { isRead: true } }
        );
        return !!result;
    }

    async markAllAsRead(userId: string): Promise<number> {
        const result = await this._model.updateMany(
            { recipientId: userId, isRead: false },
            { $set: { isRead: true } }
        );
        return result.modifiedCount;
    }
    async deleteOne(notificationId: string, userId: string): Promise<boolean> {
        const result = await this._model.deleteOne({ _id: notificationId, recipientId: userId });
        return result.deletedCount > 0;
    }

    async deleteAll(userId: string): Promise<number> {
        const result = await this._model.deleteMany({ recipientId: userId });
        return result.deletedCount;
    }

}