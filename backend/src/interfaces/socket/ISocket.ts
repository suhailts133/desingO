import type mongoose from "mongoose"

export interface IMessage {
    id: string
    activeJobId: mongoose.Types.ObjectId
    senderId: mongoose.Types.ObjectId
    senderRole: MessageRole
    content: string
    createdAt: Date
}


export interface INotification {
    id: string
    recipientId: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    title: string;
    message: string;
    activeId: mongoose.Types.ObjectId;
    isRead: boolean;
    createdAt: Date;
}

export type MessageRole = 'Customer' | 'Designer'

export interface JobChatValidation {
    role: "Customer" | "Designer";
    recipientId: string
}