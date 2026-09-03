import mongoose, { Schema, } from "mongoose";
import type { IDesignerInteraction } from "../../interfaces/designer/IDesigner";


const designerInteractionSchema = new Schema<IDesignerInteraction>(
    {
        designerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: "JobRequest", required: true },
        action: { type: String, enum: ["View", "Applied", "Accepted"], required: true },
        weight: { type: Number }
    }, { timestamps: true }
)



export const designerInteractionModel = mongoose.model<IDesignerInteraction>(
    "DesignerInteraction",
    designerInteractionSchema
);
