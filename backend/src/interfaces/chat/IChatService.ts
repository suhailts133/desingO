import type { MessageResponseDTO, SendMessageRequestDTO } from "../../DTO/chat/chatDTO";

export interface IChatService {
    getHistory(activeJobId: string, userId: string, before?:string): Promise<MessageResponseDTO[]>
    saveMessage(data: SendMessageRequestDTO): Promise<MessageResponseDTO>
}