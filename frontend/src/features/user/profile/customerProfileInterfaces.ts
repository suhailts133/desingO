
export interface UserProfileResponseDTO extends UserProfileDTO {
    profileImage?: string
    profile_image_url?: string;
}

export interface UserProfileDTO {
    full_name: string
    isGoogle: boolean
}

export type UserProfileUpdateDTO = Omit<UserProfileDTO, "isGoogle">
