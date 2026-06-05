import type { MessageResponseDTO, SendMessageRequestDTO } from "../../DTO/chat/chatDTO.js";

export interface IChatService {
    getHistory(activeJobId: string, userId: string, skip:number): Promise<MessageResponseDTO[]>
    saveMessage(data: SendMessageRequestDTO): Promise<MessageResponseDTO>
}