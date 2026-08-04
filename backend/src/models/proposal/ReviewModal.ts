
import mongoose, { Schema } from "mongoose"
import type { IReview } from "../../interfaces/proposal/IProposal"

const reviewSchema = new Schema<IReview>({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"JobRequest"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    designerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    userName: { type: String, required: true },
    profileImage: { type: String,  },
}, { timestamps: true })

export const ReviewModel = mongoose.model<IReview>("Review", reviewSchema)