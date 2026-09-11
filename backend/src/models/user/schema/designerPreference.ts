import { Schema } from "mongoose";
import type { IDesignerPreference } from "../../../interfaces/auth/IUser";

export const designerPreference = new Schema<IDesignerPreference>({
    designStyle: { type: [String] },
    propertyType: { type: [String] },
}, { _id: false })

