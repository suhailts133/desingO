import type { ImageUploadResult } from "../../designer/profile/designerProfileInterface";

export interface UserProfileResponseDTO extends UserProfileDTO {
    profileImage?: ImageUploadResult
    profile_image_url?: string;
}

export interface UserProfileDTO {
    full_name: string
    isGoogle: boolean
}

export type UserProfileUpdateDTO = Omit<UserProfileDTO, "isGoogle">
