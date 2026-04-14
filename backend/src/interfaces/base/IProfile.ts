import type { DesignerProfileDTO, DesignerProfileResponseDTO, DesignerUpdateResponseDTO, UserProfileDTO, UserProfileResponseDTO, UserProfileUpdateDTO } from "../../DTO/profile/profileDTO.js"
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
    changeProfileImage(userId: string, file: IProfileImage): Promise<IApiResponse<string>>
}

export interface IProfileImageRepository {
    changeProfilImage(userId: string, data: ImageUploadResult): Promise<string | null>
    getProfileImageId(userId: string): Promise<string | null>
}


export interface IProfileService {
    getDesignerProfile(designerId: string): Promise<IApiResponse<DesignerProfileResponseDTO>>
    updateDesignerProfile(designerId: string, data: DesignerUpdateResponseDTO): Promise<IApiResponse<DesignerUpdateResponseDTO>>
    getUserProfile(userId: string): Promise<IApiResponse<UserProfileResponseDTO>>;
    updateUserProfile(userId: string, data: UserProfileUpdateDTO): Promise<IApiResponse<UserProfileDTO>>
}
