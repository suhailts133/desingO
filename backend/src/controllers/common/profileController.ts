import type { IProfileService } from "../../interfaces/base/IProfile.js";
import asyncHandler from "express-async-handler";
import type { Request, Response } from 'express'
import { AppError } from "../../shared/errors/appError.js";
import { MESSAGES } from "../../shared/messages/messages.js";
import { RESPONSE_CODE } from "../../shared/enums/statusCode.js";
import { RespsonseHelper } from "../../shared/helpers/responseHelper.js";
import { designerProfileUpdateValidation, userProfileUpdateValidation } from "../../validators/profile/profileValidation.js";
import type { DesignerUpdateResponseDTO, UserProfileUpdateDTO } from "../../DTO/profile/profileDTO.js";
export class ProfileController {
    constructor(private _profileServices: IProfileService) { }


    getDesignerProfile = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.userId
        if (!userId) {
            throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }
        const result = await this._profileServices.getDesignerProfile(userId);
        RespsonseHelper.success(res, result);
    })


    updateDesignerProfle = asyncHandler(async (req: Request, res: Response) => {
        
        const { error, value } = designerProfileUpdateValidation.validate(req.body, { stripUnknown: true })
        if (error) {

            throw new AppError(error.details[0]?.message || "Invalid query parameters", RESPONSE_CODE.BAD_REQUEST)
        }
        const userId = req.user?.userId
        if (!userId) {
            throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }

        const result = await this._profileServices.updateDesignerProfile(userId, value as DesignerUpdateResponseDTO);
        RespsonseHelper.success(res, result);
    })


    getUserProfile = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.userId
        if (!userId) {
            throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }
        const result = await this._profileServices.getUserProfile(userId);
        RespsonseHelper.success(res, result);
    })


    updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
        console.log(req.body)
        const { error, value } = userProfileUpdateValidation.validate(req.body, { stripUnknown: true })
        if (error) {
            console.log(error, "dafasd")
            throw new AppError(error.details[0]?.message || "Invalid query parameters", RESPONSE_CODE.BAD_REQUEST)
        }
        const userId = req.user?.userId
        if (!userId) {
            throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }

        const result = await this._profileServices.updateUserProfile(userId, value as UserProfileUpdateDTO);
        RespsonseHelper.success(res, result);
    })


}