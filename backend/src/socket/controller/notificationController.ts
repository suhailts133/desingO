import type { AuthSocket } from "../SocketType";
import { handleSocketError } from "../../shared/errors/socketErrorHandler.js";
import type { INotificationService } from "../../interfaces/socket/ISocketService";

export class NotificationController {

    constructor(private _socket: AuthSocket, private _notificationService: INotificationService) { }

    /**
     * Sends a list of the user's notifications along with unread count.
     * @event fetch_notifications
     * @emits notification_list
     * @emits chat_error
     */
    fetchNotifications = async (payload: { page?: number } | string = {}) => {
        try {
            if (typeof payload === 'string') {
                payload = JSON.parse(payload) as { page?: number };
            }
            const userId = this._socket.user?.userId as string;
            const [list, unreadCount] = await Promise.all([
                this._notificationService.getUserNotifications(userId, payload.page ?? 1),
                this._notificationService.getUnreadCount(userId)
            ]);
            this._socket.emit("notification_list", { list, unreadCount });
        } catch (error) {
            handleSocketError(error, this._socket);
        }
    }

    /**
     * Marks a single notification as read.
     * @event mark_notification_read
     * @emits notification_updated
     */
    markAsRead = async (payload: { notificationId: string } | string) => {
        try {
            if (typeof payload === 'string') {
                payload = JSON.parse(payload) as { notificationId: string };
            }
            const userId = this._socket.user?.userId as string;
            await this._notificationService.markAsRead(payload.notificationId, userId);
            this._socket.emit("notification_updated", { notificationId: payload.notificationId, isRead: true });
        } catch (error) {
            handleSocketError(error, this._socket);
        }
    }

    /**
     * Marks all notifications as read for the user.
     * @event mark_all_notifications_read
     * @emits all_notifications_read
     */
    markAllAsRead = async () => {
        try {
            const userId = this._socket.user?.userId as string;
            await this._notificationService.markAllAsRead(userId);
            this._socket.emit("all_notifications_read");
        } catch (error) {
            handleSocketError(error, this._socket);
        }
    }

    /**
     * Deletes a single notification.
     * @event clear_notification
     * @emits notification_removed
     */
    clearOne = async (payload: { notificationId: string } | string) => {
        try {
            if (typeof payload === 'string') {
                payload = JSON.parse(payload) as { notificationId: string };
            }
            const userId = this._socket.user?.userId as string;
            await this._notificationService.clearOne(payload.notificationId, userId);
            this._socket.emit("notification_removed", { notificationId: payload.notificationId });
        } catch (error) {
            handleSocketError(error, this._socket);
        }
    }

    /**
     * Deletes all notifications for the user.
     * @event clear_all_notifications
     * @emits notifications_cleared
     */
    clearAll = async () => {
        try {
            const userId = this._socket.user?.userId as string;
            await this._notificationService.clearAll(userId);
            this._socket.emit("notifications_cleared");
        } catch (error) {
            handleSocketError(error, this._socket);
        }
    }
}