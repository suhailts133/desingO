import asyncHandler from "express-async-handler";
import type { Request, Response } from 'express'
import type { IProfileImage, IProfileImageService } from "../../interfaces/base/IProfile.js";
import { AppError } from "../../shared/errors/appError.js";
import { RESPONSE_CODE } from "../../shared/enums/statusCode.js";
import { RespsonseHelper } from "../../shared/helpers/responseHelper.js";
import { AUTH_MESSAGES } from "../../shared/messages/authMessages.js";
import { PROFILE_MESSAGES } from "../../shared/messages/profileMessages.js";

export class ProfileImageController {
    constructor(private _profileImageService: IProfileImageService) { }

    changeProfileImage = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.userId;
        if (!userId) {
            throw new AppError(AUTH_MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED);
        }
        
        const file = req.file as Express.Multer.File;

        if (!file) {
            throw new AppError(PROFILE_MESSAGES.PROFILE.IMAGE_NOT_FOUND, RESPONSE_CODE.BAD_REQUEST);
        }

        const profileImageData: IProfileImage = {
            profileImageFile: file
        };

        const result = await this._profileImageService.changeProfileImage(userId, profileImageData);
        RespsonseHelper.success(res, result);
    });
}