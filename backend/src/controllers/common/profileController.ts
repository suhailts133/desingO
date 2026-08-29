import type { IProfileService } from "../../interfaces/base/IProfile";
import asyncHandler from "express-async-handler";
import type { Request, Response } from 'express'
import { AppError } from "../../shared/errors/appError";
import { RESPONSE_CODE } from "../../shared/enums/statusCode";
import { RespsonseHelper } from "../../shared/helpers/responseHelper";
import { designerProfileUpdateValidation, userProfileUpdateValidation } from "../../validators/profile/profileValidation";
import type { DesignerUpdateResponseDTO, UserProfileUpdateDTO } from "../../DTO/profile/profileDTO";
import { AUTH_MESSAGES } from "../../shared/messages/authMessages";

/**
 * handle all profile realted stuff for both designer and customer execpt for profile image since its in its on controller
 */
export class ProfileController {
    constructor(private _profileServices: IProfileService) { }

    /**
     * to get designer detail
     * @route GET /profile/designer
     * @throws {AppError} 401 if there is  any issue with userId
     */
    getDesignerProfile = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.userId
        if (!userId) {
            throw new AppError(AUTH_MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }
        const result = await this._profileServices.getDesignerProfile(userId);
        RespsonseHelper.success(res, result);
    })

    /**
     *  to update designer profile
     * @route PATCH /profile/designer
     * @param req.body {@link DesignerUpdateResponseDTO} update details
     * @throws {AppError} 401 if there is any issue with userId 
     * @throws {AppError} 400 if there is any issue with req.body
     */
    updateDesignerProfle = asyncHandler(async (req: Request, res: Response) => {

        const { error, value } = designerProfileUpdateValidation.validate(req.body, { stripUnknown: true })
        if (error) {

            throw new AppError(error.details[0]?.message || "Invalid query parameters", RESPONSE_CODE.BAD_REQUEST)
        }
        const userId = req.user?.userId
        if (!userId) {
            throw new AppError(AUTH_MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }

        const result = await this._profileServices.updateDesignerProfile(userId, value as DesignerUpdateResponseDTO);
        RespsonseHelper.success(res, result);
    })

    /**
  * to get user detail
  * @route GET /profile/user
  * @throws {AppError} 401 if there is  any issue with userId
  */
    getUserProfile = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.userId
        if (!userId) {
            throw new AppError(AUTH_MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }
        const result = await this._profileServices.getUserProfile(userId);
        RespsonseHelper.success(res, result);
    })


    /**
        *  to update user profile
        * @route PATCH /profile/user
        * @param req.body {@link UserProfileUpdateDTO} update details
        * @throws {AppError} 401 if there is any issue with userId 
        * @throws {AppError} 400 if there is any issue with req.body
        */
    updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = userProfileUpdateValidation.validate(req.body, { stripUnknown: true })
        if (error) {
            throw new AppError(error.details[0]?.message || "Invalid query parameters", RESPONSE_CODE.BAD_REQUEST)
        }
        const userId = req.user?.userId
        if (!userId) {
            throw new AppError(AUTH_MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }

        const result = await this._profileServices.updateUserProfile(userId, value as UserProfileUpdateDTO);
        RespsonseHelper.success(res, result);
    })


}