import asyncHandler from "express-async-handler";
import type { Request, Response } from 'express'
import type { IProfileImage, IProfileImageService } from "../../interfaces/base/IProfile.js";
import { AppError } from "../../shared/errors/appError.js";
import { MESSAGES } from "../../shared/messages/messages.js";
import { RESPONSE_CODE } from "../../shared/enums/statusCode.js";
import { RespsonseHelper } from "../../shared/helpers/responseHelper.js";


export class ProfileImageController {
    constructor(private _profileImageService: IProfileImageService) { }

    changeProfileImage = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.userId;
        if (!userId) {
            throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED);
        }
        
        const file = req.file as Express.Multer.File;

        if (!file) {
            throw new AppError(MESSAGES.PROFILE.IMAGE_NOT_FOUND, RESPONSE_CODE.BAD_REQUEST);
        }

        const profileImageData: IProfileImage = {
            profileImageFile: file
        };

        const result = await this._profileImageService.changeProfileImage(userId, profileImageData);
        RespsonseHelper.success(res, result);
    });
}