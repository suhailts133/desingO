import type { Server } from "socket.io";
import type { AuthSocket } from "../SocketType.js";
import type { IChatService } from "../../interfaces/chat/IChatService.js";
import { handleSocketError } from "../../shared/errors/socketErrorHandler.js";
import type { ChatRoomPayload, LeaveRoomPayload, SendMessagePayload, SendMessageRequestDTO } from "../../DTO/chat/chatDTO.js";

export class ChatController {

    constructor(private _io: Server, private _socket: AuthSocket, private _chatService: IChatService) { }

    /**
     * Joins a specific chat room for an active job and retrieves message history.
     * @event join_room
     * @param {ChatRoomPayload} payload 
     * @emits message_history - Sends the array of previous messages to the requesting user.
     * @emits chat_error - If job validation fails or database error occurs.
     */
    joinRoom = async (payload: ChatRoomPayload | string) => {
        try {
            if (typeof payload === 'string') {
                payload = JSON.parse(payload) as ChatRoomPayload;
            }
            const history = await this._chatService.getHistory(
                payload.activeJobId,
                this._socket.user?.userId as string,
                payload.before)

            this._socket.join(payload.activeJobId)
            this._socket.emit("message_history", history)
        } catch (error) {
            handleSocketError(error, this._socket)
        }
    }

    /**
     * Saves a new message  and send the message back to the room.
     * @event send_message
     * @param {SendMessagePayload} payload 
     * @emits new_message - Broadcasts the newly saved message .
     * @emits chat_error - If the user lacks permission or job is inactive.
     */
    sendMessage = async (payload: SendMessagePayload | string) => {
        try {
            if (typeof payload === 'string') {
                payload = JSON.parse(payload) as SendMessagePayload;
            }
            const msg: SendMessageRequestDTO = {
                activeJobId: payload.activeJobId,
                content: payload.content,
                senderId: this._socket.user?.userId as string
            }
            const newMessage = await this._chatService.saveMessage(msg)
            this._io.to(payload.activeJobId).emit("new_message", newMessage)
        } catch (error) {
            handleSocketError(error, this._socket)
        }
    }

    /**
    * Saves a new message  and send the message back to the room.
    * @event fetch_history
    * @param {ChatRoomPayload} payload 
    * @emits history_chunk - Broadcasts the old messages .
    * @emits chat_error - If the user lacks permission or job is inactive.
    */
    fetchHistory = async (payload: ChatRoomPayload) => {
        try {
    
            if (typeof payload === 'string') {
                payload = JSON.parse(payload) as ChatRoomPayload;
            }
          
            const messages = await this._chatService.getHistory(
                payload.activeJobId,
                this._socket.user?.userId as string,
                payload.before
            )
            this._socket.emit("history_chunk", messages)
        } catch (error) {
            handleSocketError(error, this._socket)
        }
    }

    /**
     * Removes the user from a specific chat room.
     * @event leave_room
     * @param {LeaveRoomPayload} payload
     */
    leaveRoom = (payload: LeaveRoomPayload) => {
        if (typeof payload === 'string') {
            payload = JSON.parse(payload) as LeaveRoomPayload;
        }
        this._socket.leave(payload.activeJobId)
    }
}