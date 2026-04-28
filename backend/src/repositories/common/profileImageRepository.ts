import { BaseRepository } from "../baseRepository.js";
import type {  IProfileImageRepository } from "../../interfaces/base/IProfile.js";
import { UserModel } from "../../models/user/userModel.js";
import type { IUser } from "../../interfaces/auth/IUser.js";
import type { ImageUploadResult } from "../../interfaces/base/IImageUpload.js";

export class ProfileImageRepository extends BaseRepository<IUser> implements IProfileImageRepository {
    constructor() {
        super(UserModel)
    }


    async getProfileImageId(userId: string): Promise<string | null> {
        const result = await this.findById(userId)

        if (!result || !result.profile_image_url) {
            return null
        }
        return result.profile_image_url
    }


    async changeProfilImage(userId: string, data: ImageUploadResult): Promise<string | null> {
        const result = await this.update(userId, { profileImage: data })
        if (!result || !result.profileImage) {
            return null
        }
        return result.profileImage.path
    }

}