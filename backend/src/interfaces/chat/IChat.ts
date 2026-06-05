import type mongoose from "mongoose"

export interface IMessage {
    id:string
    activeJobId: mongoose.Types.ObjectId
    senderId: mongoose.Types.ObjectId
    senderRole: MessageRole
    content: string
    createdAt: Date
}

export type MessageRole = 'Customer' | 'Designer'