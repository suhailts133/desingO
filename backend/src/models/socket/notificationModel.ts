import mongoose, { Schema } from "mongoose";
import type { INotification } from "../../interfaces/socket/ISocket";

const notificationSchema = new Schema<INotification>({
    recipientId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    type: { type: String, enum: ["Message", "Job_Request", "Hire_Request", "Proposal"], required: true },
    message: { type: String, required: true },
    activeId: { type: Schema.Types.ObjectId, ref: "ActiveJob" },
    isRead: { type: Boolean, default: false }
}, { timestamps: true });


notificationSchema.index({ recipientId: 1, createdAt: -1 });

export const NotificationModel = mongoose.model<INotification>("Notification", notificationSchema);