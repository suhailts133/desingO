import asyncHandler from "express-async-handler";
import type { Request, Response } from 'express'
import type { IProfileImage, IProfileImageService } from "../interfaces/base/IProfile.js";
import { AppError } from "../helpers/errors/appError.js";
import { MESSAGES } from "../helpers/enums/messages.js";
import { RESPONSE_CODE } from "../helpers/enums/statusCode.js";
import { RespsonseHelper } from "../helpers/responseHelper.js";


export class ProfileImageController {
    constructor(private _profileImageService: IProfileImageService) { }

    changeProfileImage = asyncHandler(async (req: Request, res: Response) => {

        const userId = req.user?.userId
        if (!userId) {
            throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }

        const files = req.files as {
            profileImageFile: Express.Multer.File[]

        }

        if (!files.profileImageFile?.[0]) {
            throw new AppError(MESSAGES.PROFILE.IMAGE_NOT_FOUND, RESPONSE_CODE.BAD_REQUEST)
        }
        const profileImage = files.profileImageFile[0]
        const profileImageData: IProfileImage = {
            profileImageFile: profileImage
        }

        const result = await this._profileImageService.changeProfileImage(userId, profileImageData)
        RespsonseHelper.success(res, result)
    })
}