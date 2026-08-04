import mongoose, { Schema, } from "mongoose";
import type { IHireDesigner } from "../../interfaces/customer/ICustomer";




const hireDesignerSchema = new Schema<IHireDesigner>(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        designerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        designId: { type: mongoose.Schema.Types.ObjectId, ref: "Design" },
        status: {
            type: String,
            enum: ["Rejected", "Pending", "Accepted"],
            required: true,
            default: "Pending"
        },
        unit: { type: String,        enum: ["m", "ft"], required: true },
        length: { type: String, required: true },
        maxPrice:{type:Number, required:true},
        minPrice:{type:Number, required:true},
        width: { type: String, required: true },
        timeLine: { type: String, required: true },
        ceilingHeight: { type: String },
        rejectionReason: { type: String },
        notes: { type: String },
        services: { type: [String], required: true, default: [] },
        expiresAt: { type: Date }
    },
    { timestamps: true }
);

hireDesignerSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
export const HireDesignerModel = mongoose.model<IHireDesigner>(
    "HireDesigner",
    hireDesignerSchema
);
