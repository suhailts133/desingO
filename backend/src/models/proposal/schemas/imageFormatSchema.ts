import { Schema } from "mongoose"
import type { ImageUploadResult } from "../../../interfaces/base/IImageUpload"

export const imageFormatSchema = new Schema<ImageUploadResult>({
    path: { type: String, required: true },
    filename: { type: String, required: true },
}, { _id: false })