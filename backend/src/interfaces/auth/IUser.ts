import type { ImageUploadResult } from "../base/IImageUpload.js";

export type UserRole = "Admin" | "Customer" | "Designer";

export interface IUser {
  id: string;
  full_name: string;
  email: string;
  password: string;
  role: UserRole;
  is_blocked: boolean;
  on_investigation: boolean;
  is_verified: boolean;
  createdAt: Date;
  google_profile_id?: string;
  profile_image_url?: string;
  location?: string;
  phone?: string;
  profileImage?:ImageUploadResult
  landmark?: string;
}

export interface IUserTemp {
  full_name: string;
  email: string;
  password: string;
  otp:string
}
