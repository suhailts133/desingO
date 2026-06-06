import type { CreateMessageDTO } from "../../DTO/chat/chatDTO.js";
import type { IMessage } from "../../interfaces/chat/IChat.js";
import type { IMessageRepository } from "../../interfaces/chat/IChatRepository.js";
import { MessageModel } from "../../models/chat/messageModel.js";
import { CHAT_ENUM } from "../../shared/enums/commonEnums.js";
import { BaseRepository } from "../baseRepository.js";
import mongoose, { type QueryFilter } from "mongoose";

export class MessageRepository extends BaseRepository<IMessage> implements IMessageRepository {
    constructor() {
        super(MessageModel)
    }


    async createMessage(data: CreateMessageDTO): Promise<IMessage> {
        return await this.create({
            activeJobId: new mongoose.Types.ObjectId(data.activeJobId),
            senderId: new mongoose.Types.ObjectId(data.senderId),
            senderRole: data.senderRole,
            content: data.content,
        })
    }

    async findByActiveJob(activeJobId: string, before?: string): Promise<IMessage[]> {
  
        const query: QueryFilter<IMessage> = { activeJobId };
        if (before) {
            query._id = { $lt: before }
        }
     console.log(query)
        return await this._model.find(query)
            .sort({ createdAt: -1 })
            .limit(CHAT_ENUM.LIMIT)
            .exec()
    }
}