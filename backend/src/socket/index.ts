import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import socketAuthenticate from "../middlewares/socketAuthentication";
import { ChatService } from "../services/common/chatServices";
import { MessageRepository } from "../repositories/socket/messageRepository";
import { ActiveJobService } from "../services/customer/activeJobService";
import { ActiveJobRepository } from "../repositories/common/activeJobRepository";
import type { AuthSocket } from "./SocketType";
import { registerChatHandlers } from "./chatHandler";
import { NotificationService } from "../services/common/notificationService";
import { NotificationRepository } from "../repositories/socket/notificationRepository";
import { registerNotificationHandlers } from "./notificationHandler";
import { setIO } from "./ioInstance";
import { allowedOrigins } from "../config/cors"; 

export function initSocket(httpServer: HttpServer) {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });
  setIO(io);

  const msgRepo = new MessageRepository();
  const activeJobRepo = new ActiveJobRepository();
  const activeJobService = new ActiveJobService(activeJobRepo);
  const chatService = new ChatService(msgRepo, activeJobService);
  const notificationRepo = new NotificationRepository();
  const notificationService = new NotificationService(notificationRepo);

  io.use(socketAuthenticate);
  io.on("connection", (socket: AuthSocket) => {
    const userId = socket.user?.userId as string;
    socket.join(`user:${userId}`);

    registerChatHandlers(io, socket, chatService, notificationService);
    registerNotificationHandlers(socket, notificationService);
  });
}