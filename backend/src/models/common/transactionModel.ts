import mongoose, { Schema } from "mongoose";
import type { ITransaction } from "../../interfaces/base/ITransaction";

export const transactionSchema = new Schema<ITransaction>({
    amount: { type: Number, required: true, },
    type: {
        type: String,
        enum: ["Payment", "Commission", "Payout", "Refund"],
        required: true,
    },
    sourceUserId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    destinationUserId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,

    },
    proposalId: {
        type: Schema.Types.ObjectId,
        ref: "Proposal",
    },
    disputeId: {
        type: Schema.Types.ObjectId,
        ref: "Dispute",
    },
}, {
    timestamps: true,
});

export const TransactionModel = mongoose.model<ITransaction>("Transaction", transactionSchema);