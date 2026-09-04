
import { NotificationController } from "./controller/notificationController";
import type { INotificationService } from "../interfaces/socket/ISocketService";
import type { AuthSocket } from "./SocketType";

export function registerNotificationHandlers(socket: AuthSocket, notificationService: INotificationService) {
    const notificationController = new NotificationController(socket, notificationService);

    socket.on("fetch_notifications", notificationController.fetchNotifications)
    socket.on("mark_notification_read", notificationController.markAsRead)
    socket.on("mark_all_notifications_read", notificationController.markAllAsRead)
    socket.on("clear_notification", notificationController.clearOne)
    socket.on("clear_all_notifications", notificationController.clearAll)
}