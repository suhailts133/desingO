import mongoose, { Schema,} from "mongoose";
import type { IUser } from "../../interfaces/auth/IUser.js";



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
      default:"Customer"
    },
    profile_image_url: { type: String },
    location: { type: String },
    phone: { type: String },
    bio: { type: String },
    landmark: { type: String },
    is_blocked: { type: Boolean, default: false },
    on_investigation: { type: Boolean, default: false },
    is_verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>(
  "User",
  UserSchema
);
