import type { ImageUploadResult } from "../../interfaces/base/IImageUpload.js";

export interface UserProfileResponseDTO extends UserProfileDTO {
    profileImage?: ImageUploadResult
    profile_image_url?: string;
}

export interface UserProfileDTO {
    full_name: string
    isGoogle: boolean
}

export type UserProfileUpdateDTO = Omit<UserProfileDTO, "isGoogle">

export interface DesignerProfileResponseDTO extends DesignerProfileDTO {
    profileImage?: string
    profile_image_url?: string;
}

export interface DesignerProfileDTO {
    isGoogle: boolean
    full_name: string;
    bio: string
    phone: string;
    state: string
    city: string;
    district: string;
    portfolioUrl:string
}

export type DesignerUpdateRequestDTO = Omit<DesignerProfileDTO, "full_name" | "isGoogle">;
export type DesignerUpdateResponseDTO = Omit<DesignerProfileDTO, "isGoogle">;