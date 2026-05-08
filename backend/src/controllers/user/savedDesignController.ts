import type { ISavedDesignDTO, ISavedDesignService } from "../../interfaces/customer/ISavedDesign.js";
import asyncHandler from "express-async-handler";
import type { Request, Response } from "express"
import { RESPONSE_CODE } from "../../shared/enums/statusCode.js";
import { AppError } from "../../shared/errors/appError.js";
import { SavedDesignValidators } from "../../validators/designers/saveDesignValidators.js";
import { isObjectId } from "../../shared/helpers/extraFunctions.js";
import { DESIGNER_MESSAGES } from "../../shared/messages/designerMessages.js";
import { AUTH_MESSAGES } from "../../shared/messages/authMessages.js";
import { RespsonseHelper } from "../../shared/helpers/responseHelper.js";



// all handler related to saved designs(wishlist)
export class SavedDesignController {
    constructor(private _savedDesignService: ISavedDesignService) { }


    addOrRemoveDesign = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = SavedDesignValidators.validate(req.query, { stripUnknown: true })
        if (error) {
            throw new AppError(error.details[0]?.message || "Invalid query parameters", RESPONSE_CODE.BAD_REQUEST)
        }
        const valiedData = value as ISavedDesignDTO
        if (!isObjectId(valiedData.designId)) {
            throw new AppError(DESIGNER_MESSAGES.DESIGNS.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        const userId = req.user?.userId
        if (!userId) {
            throw new AppError(AUTH_MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }
        const result = await this._savedDesignService.addOrRemoveDesign(valiedData, userId)
        RespsonseHelper.success(res, result)
    })

    getSavedDesigns = asyncHandler(async (req: Request, res: Response) => {
        const page = req.query.page as string;
        const userId = req.user?.userId
        if (!userId) {
            throw new AppError(AUTH_MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }
        const result = await this._savedDesignService.getSavedDesigns(page)
        RespsonseHelper.successWithPagination(res, result)
    })


}