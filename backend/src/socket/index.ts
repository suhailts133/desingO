import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import socketAuthenticate from "../middlewares/socketAuthentication.js";
import { ChatService } from "../services/common/chatServices.js";
import { MessageRepository } from "../repositories/chat/messageRepository.js";
import { ActiveJobService } from "../services/customer/activeJobService.js";
import { ActiveJobRepository } from "../repositories/common/activeJobRepository.js";
import type { AuthSocket } from "./SocketType.js";
import { registerChatHandlers } from "./chatHandler.js";

export function initSocket(httpServer: HttpServer) {
    const io = new SocketServer(httpServer, {
        cors: {
            origin: "*",
    methods: ["GET", "POST"],
            credentials: true,
        }
    })

    const msgRepo = new MessageRepository()
    const activeJobRepo = new ActiveJobRepository()
    const activeJobService = new ActiveJobService(activeJobRepo)
    const chatService = new ChatService(msgRepo, activeJobService)
    io.use(socketAuthenticate)
    io.on("connection", (socket: AuthSocket) => {
        registerChatHandlers(io, socket, chatService)
    })
}