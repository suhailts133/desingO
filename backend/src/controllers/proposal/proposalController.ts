import type { IProposalService, IProposalVersionService } from "../../interfaces/proposal/IProposalService";
import type { Request, Response } from "express"
import { RespsonseHelper } from "../../shared/helpers/responseHelper"
import { RESPONSE_CODE } from "../../shared/enums/statusCode"
import type { CreateProposalDTO, ProposalAcceptOrRejectDTO, ServiceResultDTO } from "../../DTO/proposal/proposal";

import asyncHandler from "express-async-handler";
import { AppError } from "../../shared/errors/appError"
import { createProposalValidation } from "../../validators/proposal/proposalValidator";
import { JOB_MESSAGES } from "../../shared/messages/jobMessages";
import { isObjectId } from "../../shared/helpers/extraFunctions";
import { PROPOSAL_MESSAGES } from "../../shared/messages/proposalMessages";
import { proposalApproveOrRejectionValidation } from "../../validators/proposal/proposalAcceptOrRejectValidation";
import { versionApproveOrRejectValidation } from "../../validators/proposal/versionAcceptOrRejectValidation";
import type { VersionAcceptOrRejectDTO } from "../../DTO/proposal/version";



/**
 * This controller has everything realted to proposal/contract
 */

export class ProposalController {
    constructor(private _proposalService: IProposalService, private _proposalVersionService: IProposalVersionService) { }


    /**
   * for create new PRoposal
   * @route POST /proposal/create
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


    /**
   * to accept or reject the proposal
   * @route PATCH /proposal/approve-reject
   * @param req.body {@link ProposalAcceptOrRejectDTO}
   * @throws {AppError} 400 if there is any issue with req.body
  */
    updateProposalStatus = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = proposalApproveOrRejectionValidation.validate(req.body, { stripUnknown: true })
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }
        const validated = value as ProposalAcceptOrRejectDTO
        const result = await this._proposalService.approveOrRejectProposal(validated)
        RespsonseHelper.success(res, result)
    })


    /**
   * to get the proposal
   * @route GET /proposal/:id
   * @param req.params.id jobid
   * @throws {AppError} 400 if there is no jobid or the format of job id is wrong
  */
    getProposal = asyncHandler(async (req: Request, res: Response) => {
        const jobId = req.params.id as string;
        if (!jobId) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        if (!isObjectId(jobId)) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        const result = await this._proposalService.getProposal(jobId);
        RespsonseHelper.success(res, result)
    })
    /**
   * to get the proposal
   * @route GET /proposal/prefill/:id
   * @param req.params.id jobid
   * @param req.body jobRequest | "DirectHire"
   * @throws {AppError} 400 if there is no jobid or the format of job id is wrong
   * @throws {AppError} 400 if there is any problem with req.body
  */
    getProposalTemplate = asyncHandler(async (req: Request, res: Response) => {
        const jobId = req.params.id as string;
        if (!jobId) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        if (!isObjectId(jobId)) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        const source = req.params.slug as 'jobRequest' | 'direct_hire';

        if (source !== "jobRequest" && source !== "direct_hire") {
            throw new AppError(PROPOSAL_MESSAGES.PROPOSAL_INPUT.UNKONW_DATA, RESPONSE_CODE.BAD_REQUEST)
        }
        const result = source === "jobRequest" ? await this._proposalService.getProposalInputForJobRequest(jobId) : await this._proposalService.getProposalTemplateForDirecHire(jobId)
        RespsonseHelper.success(res, result)
    })

    /**
 * to upload result for the service
 * @route POST /proposal/upload-result
 * @param req.body.sourceId jobid
 * @param req.body.serviceNumber the service order
 * @param req.files.serviceResult the service upload result
 * @throws {AppError} 400 if there is any issue with the req.body
 * @throws {AppError} 400 if there is no items in req.files.serviceReult
*/
    uploadServiceResult = asyncHandler(async (req: Request, res: Response) => {

        const { serviceNumber, sourceId } = req.body as ServiceResultDTO
        if (!sourceId) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        if (!isObjectId(sourceId)) {

            throw new AppError(JOB_MESSAGES.JOB_REQUEST.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        const files = req.files as {
            serviceResult: Express.Multer.File[]
        }

        const serviceResult: Express.Multer.File[] = files.serviceResult ?? []
        if (serviceResult.length === 0) {
            throw new AppError(PROPOSAL_MESSAGES.SERVICE.SERVICE_RESULT_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        const result = await this._proposalVersionService.uploadProposalImage(sourceId, serviceNumber, serviceResult);
        RespsonseHelper.success(res, result)
    })

    /**
 * to approve or reject service
 * @route PATCH /proposal/approve-reject-version
 * @param req.body {@link VersionAcceptOrRejectDTO}
 * @throws {AppError} 400 if there is any issue with the req.body

*/
    approveOrRejectVersion = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = versionApproveOrRejectValidation.validate(req.body, { stripUnknown: true })
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }
        const valided = value as VersionAcceptOrRejectDTO
        const result = await this._proposalVersionService.acceptOrRejectVersion(valided)
        RespsonseHelper.success(res, result)
    })
}