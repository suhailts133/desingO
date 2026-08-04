import type { CreateMessageDTO } from "../../DTO/chat/chatDTO";
import type { IMessage } from "../../interfaces/chat/IChat";
import type { IMessageRepository } from "../../interfaces/chat/IChatRepository";
import { MessageModel } from "../../models/chat/messageModel";
import { CHAT_ENUM } from "../../shared/enums/commonEnums";
import { BaseRepository } from "../baseRepository";
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