import { Server as SocketServer } from "socket.io"
import type { AuthSocket } from "./SocketType.js";
import type { IChatService } from "../interfaces/chat/IChatService.js";
import { ChatController } from "./controller/chatController.js";


export function registerChatHandlers(io: SocketServer, socket: AuthSocket, chatService: IChatService) {
    const chatController = new ChatController(io, socket, chatService);

    socket.on("join_room", chatController.joinRoom)
    socket.on("send_message", chatController.sendMessage)
    socket.on("leave_room", chatController.leaveRoom)
}
