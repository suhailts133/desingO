import asyncHandler from "express-async-handler";
import { AppError } from "../../shared/errors/appError"
import type { Request, Response } from "express"

// handle all  customer and designer dispute related rotues

import type { IDisputeService } from "../../interfaces/proposal/IDispute";
import { acceptOrRejectDisputeValidation, disputeRaiseBodyValidation } from "../../validators/proposal/disputeValidation";
import type { AcceptOrRejectDisputeDTO, DisputeRaiseBody, DisputeRaiseDTO } from "../../DTO/proposal/dispute";
import { AUTH_MESSAGES } from "../../shared/messages/authMessages";
import { RESPONSE_CODE } from "../../shared/enums/statusCode";
import { PROPOSAL_MESSAGES } from "../../shared/messages/proposalMessages";
import { RespsonseHelper } from "../../shared/helpers/responseHelper";
import { isObjectId } from "../../shared/helpers/extraFunctions";

export class DisputeController {
    constructor(private _disputeService: IDisputeService) { }

    /**
     * for posting new dispute
     * @route POST /dispute/report-issue
     * @param req.body {@link DisputeRaiseBody}
     * @param req.files.evidence - multiple images (required)
     * @throws {AppError} 400 if there is any issue with req.body
     * @throws {AppError} 400 if there is any issue with req.files
     * @throws {AppError} 401 if user is authenticated
    */
    reportIssue = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = disputeRaiseBodyValidation.validate(req.body, { stripUnknown: true })
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }
        const validData = value as DisputeRaiseBody
        const reporterId = req.user?.userId as string;
        if (!reporterId) {
            throw new AppError(AUTH_MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }

        const files = req.files as {
            evidence?: Express.Multer.File[]
        }
        if (!files.evidence || files.evidence.length <= 0) {
            throw new AppError(PROPOSAL_MESSAGES.DISPUTE.EVIDENCE, RESPONSE_CODE.BAD_REQUEST)
        }
        const data: DisputeRaiseDTO = {
            ...validData,
            evidence: files.evidence
        }
        const result = await this._disputeService.createDispute(data, reporterId)
        RespsonseHelper.success(res, result)
    })

    /**
       * for accepting or rejecting the solution the admin made
       * @route PATCH /dispute/accept-reject
       * @param req.body {@link AcceptOrRejectDisputeDTO}
       * @throws {AppError} 400 if there is any issue with req.body
      */
    acceptOrRejectDispute = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = acceptOrRejectDisputeValidation.validate(req.body, { stripUnknown: true })
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }
        const validatedData = value as AcceptOrRejectDisputeDTO

        const result = await this._disputeService.AcceptOrRejectDispute(validatedData)
        RespsonseHelper.success(res, result)
    })
    /**
       * for fetching the dispute
       * @route GET /dispute/:id
       * @param req.params.id disputeid
       * @throws {AppError} 400 if there is any issue with req.body
      */
    getDispute = asyncHandler(async (req: Request, res: Response) => {
        const proposalId = req.params.id as string
        if (!isObjectId(proposalId)) {
            throw new AppError(PROPOSAL_MESSAGES.DISPUTE.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }

        const result = await this._disputeService.getDispute(proposalId)
        RespsonseHelper.success(res, result)
    })

    /**
       * for fetching all the dispute
       * @route GET /dispute/
       * @param req.body.proposalId disputeid
       * @throws {AppError} 400 if there is any issue with req.body
      */
    getAllDispute = asyncHandler(async (req: Request, res: Response) => {
        const { proposalId } = req.body;
        if (!isObjectId(proposalId)) {
            throw new AppError(PROPOSAL_MESSAGES.DISPUTE.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }

        const result = await this._disputeService.getAllDisputePerProposal(proposalId)
        RespsonseHelper.success(res, result)
    })


}