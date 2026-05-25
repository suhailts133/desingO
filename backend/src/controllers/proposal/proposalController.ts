import type { IProposalService } from "../../interfaces/proposal/IProposalService.js";
import type { Request, Response } from "express"
import { RespsonseHelper } from "../../shared/helpers/responseHelper.js"
import { RESPONSE_CODE } from "../../shared/enums/statusCode.js"
import type { CreateProposalDTO } from "../../DTO/proposal/proposal.js";

import asyncHandler from "express-async-handler";
import { AppError } from "../../shared/errors/appError.js"
import { createProposalValidation } from "../../validators/proposal/proposalValidator.js";


/**
 * This controller has everything realted to proposal/contract
 */

export class ProposalController {
    constructor(private _proposalService: IProposalService) { }


    /**
   * for create new PRoposal
   * @route POST proposal/create
   * @param req.body {@link CreateProposalDTO}
   * @throws {AppError} 400 if there is any issue with req.body
  */
    createProposal = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = createProposalValidation.validate(req.body, { stripUnknown: true })
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }
        const validated = value as CreateProposalDTO
        const result = await this._proposalService.createProposal(validated)
        RespsonseHelper.success(res, result)
    })
}