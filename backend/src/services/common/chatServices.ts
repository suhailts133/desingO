import type { SendMessageRequestDTO, MessageResponseDTO, CreateMessageDTO, saveMessageResponseDTO } from "../../DTO/socket/chatDTO";
import { MessageMapper } from "../../dtoMappers/common/messageMapper";
import type { IMessageRepository } from "../../interfaces/socket/ISocketRepository";
import type { IChatService } from "../../interfaces/socket/ISocketService";
import type { IActiveJobService } from "../../interfaces/customer/ICustomerService";

export class ChatService implements IChatService {
    constructor(private _messageRepo: IMessageRepository, private _activeJobService: IActiveJobService) { }

    async saveMessage(data: SendMessageRequestDTO): Promise<saveMessageResponseDTO> {

        const { recipientId, role } = await this._activeJobService.validateJobForChat(data.activeJobId, data.senderId);

        const messageToSave: CreateMessageDTO = {
            activeJobId: data.activeJobId,
            content: data.content.trim(),
            senderId: data.senderId,
            senderRole: role
        };

        const savedMessage = await this._messageRepo.createMessage(messageToSave);

        return { message: MessageMapper.toMessageDTO(savedMessage), recipientId };
    }

    async getHistory(activeJobId: string, userId: string, before?: string): Promise<MessageResponseDTO[]> {

        await this._activeJobService.validateJobForChat(activeJobId, userId);
        const messages = await this._messageRepo.findByActiveJob(activeJobId, before)
        return MessageMapper.toMessageDTOlist(messages).reverse();
    }
}