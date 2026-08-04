import type { MessageRole } from "../../interfaces/chat/IChat"

export interface CreateMessageDTO {
    activeJobId: string
    senderId: string
    senderRole: MessageRole
    content: string
}


export type SendMessageRequestDTO = Omit<CreateMessageDTO, "senderRole">



export interface SendMessagePayload {
    activeJobId: string
    content: string
}


export interface ChatRoomPayload {
    activeJobId: string;
    before?: string
}

export type LeaveRoomPayload = Omit<SendMessagePayload, "content">

export interface MessageResponseDTO {
    id: string,
    activeJobId: string,
    senderId: string,
    senderRole: MessageRole,
    content: string,
    createdAt: string
}

