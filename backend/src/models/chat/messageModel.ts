import mongoose, { Schema } from "mongoose";
import type { IMessage } from "../../interfaces/chat/IChat";

const messageSchema = new Schema<IMessage>({
    activeJobId: { type: Schema.Types.ObjectId, ref: "ActiveJob", required: true, index: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true, },
    senderRole: { type: String, enum: ["Customer", "Designer"], required: true },
    content: { type: String, required: true }
}, { timestamps: true })


export const MessageModel = mongoose.model<IMessage>("Message", messageSchema)