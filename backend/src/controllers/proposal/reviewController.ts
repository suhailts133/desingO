import type { IReviewService } from "../../interfaces/proposal/IProposalService";
import type { Request, Response } from "express"
import { RespsonseHelper } from "../../shared/helpers/responseHelper"
import { RESPONSE_CODE } from "../../shared/enums/statusCode"

import asyncHandler from "express-async-handler";
import { reviewValidation } from "../../validators/proposal/reviewValidator";
import { AppError } from "../../shared/errors/appError";
import type { ReviewPayload } from "../../DTO/proposal/review";
import { isObjectId } from "../../shared/helpers/extraFunctions";
import { AUTH_MESSAGES } from "../../shared/messages/authMessages";
import { DESIGNER_MESSAGES } from "../../shared/messages/designerMessages";
import Logger from "../../config/logger";

export class ReviewController {
    constructor(private _reviewService: IReviewService) { }



    /**
   * for create new review
   * @route POST /review/create
   * @param req.body {@link ReviewPayload}
   * @throws {AppError} 400 if there is any issue with req.body
   * @throws {AppError} 401 if user is authenticated
  */
    createReview = asyncHandler(async (req: Request, res: Response) => {
        const userid = req.user?.userId;
        if (!userid) {
            throw new AppError(AUTH_MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }
        if (!isObjectId(userid)) {
            throw new AppError(AUTH_MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }
        const { error, value } = reviewValidation.validate(req.body, { stripUnknown: true })
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }
        const validated = value as ReviewPayload
        Logger.info(`${JSON.stringify(validated)}`)
        const result = await this._reviewService.createReview(userid, validated)
         Logger.info(`${JSON.stringify(result)}`)
        RespsonseHelper.success(res, result)
    })


    /**
     * to get all designer reviews
     * @route GET /review/my/:id
     * @param req.params.id  designerId
     * @throws {AppError} 400 if there is no designerid or if designer id is not in the format of the object id
     */
    getMyReviews = asyncHandler(async (req: Request, res: Response) => {
        const page = req.query.page as string;
        const designerId = req.params.id as string
        if (!designerId) {
            throw new AppError(DESIGNER_MESSAGES.DESIGNER.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        if (!isObjectId(designerId)) {
            throw new AppError(DESIGNER_MESSAGES.DESIGNER.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        const result = await this._reviewService.getMyReviews(designerId, page)
        RespsonseHelper.successWithPagination(res, result)

    })
}