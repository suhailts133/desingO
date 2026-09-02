import mongoose, { Schema, } from "mongoose";
import type { ICustomerInteraction, } from "../../interfaces/customer/ICustomer";


const customerInteractionSchema = new Schema<ICustomerInteraction>(
    {
        customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        designId: { type: mongoose.Schema.Types.ObjectId, ref: "Design", required: true },
        action: { type: String, enum: ["View", "Save", "Hire"], required: true },
        weight: { type: Number }
    }, { timestamps: true }
)



export const CustomerInteractionModel = mongoose.model<ICustomerInteraction>(
    "CustomerInteraction",
    customerInteractionSchema
);
