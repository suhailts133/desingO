import type { CreateMessageDTO } from "../../DTO/chat/chatDTO.js";
import type { IMessage } from "./IChat.js";

export interface IMessageRepository {
    createMessage(data: CreateMessageDTO): Promise<IMessage>;
    findByActiveJob(activeJobId: string, before?: string): Promise<IMessage[]>
}