import mongoose, { Schema, } from "mongoose";
import type { IUser } from "../../interfaces/auth/IUser.js";
import type { ImageUploadResult } from "../../interfaces/base/IImageUpload.js";


const imageFormatSchema = new Schema<ImageUploadResult>({
  path: { type: String, required: true },
  filename: { type: String, required: true },
}, { _id: false })




const UserSchema = new Schema<IUser>(
  {
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    google_profile_id: { type: String },
    role: {
      type: String,
      enum: ["Admin", "Customer", "Designer"],
      required: true,
      default: "Customer"
    },
    profile_image_url: { type: String },
    location: { type: String },
    phone: { type: String },
    landmark: { type: String },
    is_blocked: { type: Boolean, default: false },
    on_investigation: { type: Boolean, default: false },
    is_verified: { type: Boolean, default: false },
    profileImage: { type: imageFormatSchema },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>(
  "User",
  UserSchema
);
