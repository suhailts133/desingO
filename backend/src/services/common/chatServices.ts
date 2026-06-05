import Logger from "../../config/logger.js";
import type { SendMessageRequestDTO, MessageResponseDTO, CreateMessageDTO } from "../../DTO/chat/chatDTO.js";
import { MessageMapper } from "../../dtoMappers/common/messageMapper.js";
import type { IMessageRepository } from "../../interfaces/chat/IChatRepository.js";
import type { IChatService } from "../../interfaces/chat/IChatService.js";
import type { IActiveJobService } from "../../interfaces/customer/ICustomerService.js";

export class ChatService implements IChatService {
    constructor(private _messageRepo: IMessageRepository, private _activeJobService: IActiveJobService) { }

    async saveMessage(data: SendMessageRequestDTO): Promise<MessageResponseDTO> {

        const role = await this._activeJobService.validateJobForChat(data.activeJobId, data.senderId);

        const messageToSave: CreateMessageDTO = {
            activeJobId: data.activeJobId,
            content: data.content.trim(),
            senderId: data.senderId,
            senderRole: role
        };

        const savedMessage = await this._messageRepo.createMessage(messageToSave);

        return MessageMapper.toMessageDTO(savedMessage);
    }

    async getHistory(activeJobId: string, userId: string, skip: number): Promise<MessageResponseDTO[]> {
        Logger.info(`jobid from get history ${activeJobId}`)
        await this._activeJobService.validateJobForChat(activeJobId, userId);
        const messages = await this._messageRepo.findByActiveJob(activeJobId, skip)
        return MessageMapper.toMessageDTOlist(messages);
    }
}