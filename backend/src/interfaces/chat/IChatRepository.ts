import type { CreateMessageDTO } from "../../DTO/chat/chatDTO";
import type { IMessage } from "./IChat";

export interface IMessageRepository {
    createMessage(data: CreateMessageDTO): Promise<IMessage>;
    findByActiveJob(activeJobId: string, before?: string): Promise<IMessage[]>
}