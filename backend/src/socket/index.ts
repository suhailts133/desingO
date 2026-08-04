import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import socketAuthenticate from "../middlewares/socketAuthentication";
import { ChatService } from "../services/common/chatServices";
import { MessageRepository } from "../repositories/chat/messageRepository";
import { ActiveJobService } from "../services/customer/activeJobService";
import { ActiveJobRepository } from "../repositories/common/activeJobRepository";
import type { AuthSocket } from "./SocketType";
import { registerChatHandlers } from "./chatHandler";

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