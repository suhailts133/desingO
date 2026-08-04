import type { MessageResponseDTO } from "../../DTO/chat/chatDTO";
import type { IMessage } from "../../interfaces/chat/IChat";

export class MessageMapper {
    static toMessageDTO(data: IMessage): MessageResponseDTO {
        return {
            id: data.id,
            senderId: data.senderId.toString(),
            activeJobId: data.activeJobId.toString(),
            senderRole: data.senderRole,
            createdAt: data.createdAt.toISOString(),
            content: data.content
        }
    }

    static toMessageDTOlist(data: IMessage[]): MessageResponseDTO[] {
        return data.map(msg => this.toMessageDTO(msg))
    }
}