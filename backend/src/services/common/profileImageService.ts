import { CLOUDINARY_FOLDER_NAME } from "../../shared/enums/commonEnums.js";
import { RESPONSE_CODE } from "../../shared/enums/statusCode.js";
import { AppError } from "../../shared/errors/appError.js";
import type { IApiResponse } from "../../interfaces/base/IApiResponse.js";
import type { IImageUploaderService } from "../../interfaces/base/IImageUpload.js";
import type { IProfileImage, IProfileImageService } from "../../interfaces/base/IProfile.js";
import { PROFILE_MESSAGES } from "../../shared/messages/profileMessages.js";
import type { IUserRepository } from "../../interfaces/auth/IUserRepository.js";
import { AUTH_MESSAGES } from "../../shared/messages/authMessages.js";

export class ProfileImageService implements IProfileImageService {
    constructor(private _userRepo: IUserRepository, private _imageService: IImageUploaderService) { }


    async changeProfileImage(userId: string, file: IProfileImage): Promise<IApiResponse<string>> {

        const userData = await this._userRepo.findUserById(userId);
        if (!userData) {
            throw new AppError(AUTH_MESSAGES.USER.NOT_FOUND, RESPONSE_CODE.NO_CONTENT)
        }
        const imageUploadResult = await this._imageService.upload(file.profileImageFile, CLOUDINARY_FOLDER_NAME.PROFILE_IMAGES)
        const profileImageUpdated = await this._userRepo.updateUser(userId, { profileImage: imageUploadResult })

        if (!profileImageUpdated?.profileImage) {
            throw new AppError(PROFILE_MESSAGES.PROFILE.UPDATE_FAIL, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        if (userData.profile_image_url) {
            await this._imageService.delete(userData.profile_image_url)
        }

        return { message: PROFILE_MESSAGES.PROFILE.IMAGE_UPLOAD_RESULT, data: profileImageUpdated.profileImage?.path }

    }
}