import type mongoose from "mongoose"

export interface IMessage {
    id: string
    activeJobId: mongoose.Types.ObjectId
    senderId: mongoose.Types.ObjectId
    senderRole: MessageRole
    content: string
    createdAt: Date
}

export type NotificationType = "Message" | "Job_Request" | "Hire_Request" | "Proposal"

export interface INotification {
    id: string
    recipientId: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    type: NotificationType
    title: string;
    message: string;
    activeId?: mongoose.Types.ObjectId;
    isRead: boolean;
    createdAt: Date;
}

export type MessageRole = 'Customer' | 'Designer'

export interface JobChatValidation {
    role: "Customer" | "Designer";
    recipientId: string
}