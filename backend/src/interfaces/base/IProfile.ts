import type { DesignerProfileDTO, DesignerProfileResponseDTO, UserProfileDTO, UserProfileResponseDTO, UserProfileUpdateDTO } from "../../DTO/profile/profileDTO.js"
import type { IApiResponse } from "./IApiResponse.js"
import type { ImageUploadResult } from "./IImageUpload.js"

export interface IProfileImage {
    profileImageFile: Express.Multer.File
}

export interface ChangeProfileImageResponseDTO {
    path: string,
    filename: string
}




export interface IProfileImageService {
    changeProfileImage(userId: string, file: IProfileImage): Promise<IApiResponse<ChangeProfileImageResponseDTO>>
}

export interface IProfileImageRepository {
    changeProfilImage(userId: string, data: ImageUploadResult): Promise<ChangeProfileImageResponseDTO | null>
    getProfileImageId(userId: string): Promise<string | null>
}


export interface IProfileService {
    getDesignerProfile(designerId: string): Promise<IApiResponse<DesignerProfileResponseDTO>>
    updateDesignerProfile(designerId: string, data: DesignerProfileDTO): Promise<IApiResponse<DesignerProfileDTO>>
    getUserProfile(userId: string): Promise<IApiResponse<UserProfileResponseDTO>>;
    updateUserProfile(userId: string, data: UserProfileUpdateDTO): Promise<IApiResponse<UserProfileDTO>>
}
