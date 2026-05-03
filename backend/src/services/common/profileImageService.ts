import { CLOUDINARY_FOLDER_NAME } from "../../shared/enums/commonEnums.js";
import { RESPONSE_CODE } from "../../shared/enums/statusCode.js";
import { AppError } from "../../shared/errors/appError.js";
import type { IApiResponse } from "../../interfaces/base/IApiResponse.js";
import type { IImageUploaderService } from "../../interfaces/base/IImageUpload.js";
import type {  IProfileImage, IProfileImageRepository, IProfileImageService } from "../../interfaces/base/IProfile.js";
import { PROFILE_MESSAGES } from "../../shared/messages/profileMessages.js";

export class ProfileImageService implements IProfileImageService {
    constructor(private _profileImageRepo: IProfileImageRepository, private _imageService: IImageUploaderService) { }


    async changeProfileImage(userId: string, file: IProfileImage): Promise<IApiResponse<string>> {
        const profileImageId = await this._profileImageRepo.getProfileImageId(userId);
        console.log(profileImageId)
        const imageUploadResult = await this._imageService.upload(file.profileImageFile, CLOUDINARY_FOLDER_NAME.PROFILE_IMAGES)
        const profileRepoResult = await this._profileImageRepo.changeProfilImage(userId, imageUploadResult)
        console.log(profileRepoResult)
        if(!profileRepoResult){
            throw new AppError(PROFILE_MESSAGES.PROFILE.UPDATE_FAIL, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        if (profileImageId) {
            await this._imageService.delete(profileImageId)
        }
    
        return { success: true, statuscode: RESPONSE_CODE.OK, message: PROFILE_MESSAGES.PROFILE.IMAGE_UPLOAD_RESULT, data: profileRepoResult }

    }
}