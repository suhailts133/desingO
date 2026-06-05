import type { AuthSocket } from "../../socket/SocketType.js";
import { AppError } from "./appError.js";

export const handleSocketError = (error: unknown, socket: AuthSocket) => {

    console.error('[Socket Error]:', error);

    if (error instanceof AppError) {
        socket.emit('chat_error', {
            success: false,
            message: error.message,
            code: error.statusCode,
        });
        return;
    }

    if (error instanceof Error) {
        socket.emit('chat_error', {
            success: false,
            message: error.message,
            code: 500,
        });
        return;
    }

    socket.emit('chat_error', {
        success: false,
        message: 'An unknown server error occurred',
        code: 500,
    });
};