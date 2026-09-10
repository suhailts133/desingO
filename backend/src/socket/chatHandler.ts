import { Server as SocketServer } from "socket.io"
import type { AuthSocket } from "./SocketType";
import type { IChatService, INotificationService } from "../interfaces/socket/ISocketService";
import { ChatController } from "./controller/chatController";


export function registerChatHandlers(io: SocketServer, socket: AuthSocket, chatService: IChatService, notificatonService: INotificationService) {
    const chatController = new ChatController(io, socket, chatService, notificatonService);

    socket.on("join_room", chatController.joinRoom)
    socket.on("send_message", chatController.sendMessage)
    socket.on("leave_room", chatController.leaveRoom)
    socket.on("fetch_history", chatController.fetchHistory)
}
