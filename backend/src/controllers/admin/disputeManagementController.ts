import type { IAdminDisputeService } from "../../interfaces/admin/IDisputeService";
import asyncHandler from "express-async-handler";
import type { Request, Response } from "express";
import type { DisputeAdminFilters, DisputeSolutionDTO } from "../../DTO/proposal/dispute";
import { RespsonseHelper } from "../../shared/helpers/responseHelper";
import { isObjectId } from "../../shared/helpers/extraFunctions";
import { AppError } from "../../shared/errors/appError";
import { PROPOSAL_MESSAGES } from "../../shared/messages/proposalMessages";
import { RESPONSE_CODE } from "../../shared/enums/statusCode";
import { disputeSolutionValidation } from "../../validators/proposal/disputeValidation";
export class DisputeManagementController {
    constructor(private _disputeService: IAdminDisputeService) { }


    getAllDispute = asyncHandler(async (req: Request, res: Response) => {
        const result = await this._disputeService.getAllDispute(req.query as DisputeAdminFilters)
        RespsonseHelper.successWithPagination(res, result)
    })

    getDisputeDetail = asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id as string
        if (!isObjectId(id)) {
            throw new AppError(PROPOSAL_MESSAGES.DISPUTE.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }

        const result = await this._disputeService.getDisputeDetail(id)
        RespsonseHelper.success(res, result)
    })


    giveVerdit = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = disputeSolutionValidation.validate(req.body)
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }

        const valiedData = value as DisputeSolutionDTO
        const result = await this._disputeService.disputeSolution(valiedData)
        RespsonseHelper.success(res, result)
    })

}