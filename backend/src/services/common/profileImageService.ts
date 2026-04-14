import { response } from "express";
import { CLOUDINARY_FOLDER_NAME } from "../../helpers/enums/commonEnums.js";
import { MESSAGES } from "../../helpers/enums/messages.js";
import { RESPONSE_CODE } from "../../helpers/enums/statusCode.js";
import { AppError } from "../../helpers/errors/appError.js";
import type { IApiResponse } from "../../interfaces/base/IApiResponse.js";
import type { IImageUploaderService } from "../../interfaces/base/IImageUpload.js";
import type { ChangeProfileImageResponseDTO, IProfileImage, IProfileImageRepository, IProfileImageService } from "../../interfaces/base/IProfile.js";

export class ProfileImageService implements IProfileImageService {
    constructor(private _profileImageRepo: IProfileImageRepository, private _imageService: IImageUploaderService) { }


    async changeProfileImage(userId: string, file: IProfileImage): Promise<IApiResponse<string>> {
        const profileImageId = await this._profileImageRepo.getProfileImageId(userId);
        console.log(profileImageId)
        const imageUploadResult = await this._imageService.upload(file.profileImageFile, CLOUDINARY_FOLDER_NAME.PROFILE_IMAGES)
        const profileRepoResult = await this._profileImageRepo.changeProfilImage(userId, imageUploadResult)
        console.log(profileRepoResult)
        if(!profileRepoResult){
            throw new AppError(MESSAGES.PROFILE.UPDATE_FAIL, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        if (profileImageId) {
            await this._imageService.delete(profileImageId)
        }
    
        return { success: true, statuscode: RESPONSE_CODE.OK, message: MESSAGES.PROFILE.IMAGE_UPLOAD_RESULT, data: profileRepoResult }

    }
}