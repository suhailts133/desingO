import { Schema } from "mongoose"
import type { IEscrow } from "../../../interfaces/proposal/IProposal"

export const escrowSchema = new Schema<IEscrow>({
    amountHeld: { type: Number, required: true },
    platformCommission: { type: Number, required: true },
    designerPayout: { type: Number, required: true },
    status: {
        type: String,
        enum: ["Held", "Released", "Refunded", "Disputed"],
        required: true
    },
    releasedAt: { type: Date },
}, { _id: false })