import type { CreateProposalDTO, CreateProposalRepoDataDTO, ProposalAcceptOrRejectDTO, ProposalDetailDTO, ProposalInputData } from "../../DTO/proposal/proposal.js";
import { ProposalMapper } from "../../dtoMappers/proposal/proposalMapper.js";
import { HireDesignerMapper } from "../../dtoMappers/user/hireDesignerMapper.js";
import { JobRequestMapper } from "../../dtoMappers/user/jobRequestMapper.js";
import type { IApiResponse } from "../../interfaces/base/IApiResponse.js";
import type { IActiveJobRepository, IHireDesignerRepository, IJobRepository } from "../../interfaces/customer/ICustomerRepository.js";
import type { IServiceItem } from "../../interfaces/proposal/IProposal.js";
import type { IProposalRepository } from "../../interfaces/proposal/IProposalRepository.js";
import type { IProposalService } from "../../interfaces/proposal/IProposalService.js";

import { RESPONSE_CODE } from "../../shared/enums/statusCode.js";
import { AppError } from "../../shared/errors/appError.js";
import { toSqFt } from "../../shared/helpers/extraFunctions.js";
import { validateServiceOrders } from "../../shared/helpers/proposalOrderCheck.js";
import { JOB_MESSAGES } from "../../shared/messages/jobMessages.js";
import { PROPOSAL_MESSAGES } from "../../shared/messages/proposalMessages.js";

export class ProposalService implements IProposalService {
    constructor(private _proposalRepo: IProposalRepository, private _activeRepo: IActiveJobRepository, private _jobRepo: IJobRepository, private _directHireRepo: IHireDesignerRepository) { }

    async createProposal(data: CreateProposalDTO): Promise<IApiResponse> {
        const activeJob = await this._activeRepo.getActiveJobBySource(data.sourceId);
        if (!activeJob) {
            throw new AppError(JOB_MESSAGES.ACTIVE_JOB.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        const proposal = await this._proposalRepo.getProposal(data.sourceId)
        if (proposal) {
            throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.EXISTS, RESPONSE_CODE.CONFILT)
        }
        const job = await this._jobRepo.getJobRequest(data.sourceId);
        if (!job) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        let totalSqft = 0
        for (const items of job.rooms) {
            totalSqft += toSqFt(Number(items.length), Number(items.width), items.unit)
        }
        const expectedTotalDrawingFee = data.drawingFeePerSqFt * totalSqft


        const totalDrawingFee = data.services.reduce((acc, cur) => acc + cur.price, 0)
        validateServiceOrders(data.services)
        if (expectedTotalDrawingFee !== totalDrawingFee) {
            throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.PRICE_MISMATCH(expectedTotalDrawingFee, totalDrawingFee), RESPONSE_CODE.BAD_REQUEST)
        }

        const totalExecutionFee = data.services.reduce((acc, cur) => acc + cur.executionPrice, 0)
        const totalContractValue = totalDrawingFee + totalExecutionFee

        const repoData: CreateProposalRepoDataDTO = {
            ...data,
            clientId: activeJob.userId.toString(),
            designerId: activeJob.designerId.toString(),
            totalDrawingFee,
            totalExecutionFee,
            totalContractValue,
            sourceName: activeJob.sourceName,
            services: data.services as unknown as IServiceItem[]
        }

        const result = await this._proposalRepo.createProposal(repoData)
        if (!result) {
            throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.CREATION_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        const activeJobProposalStatusChange = await this._activeRepo.updateActiveJob(data.sourceId, { proposalStatus: "CREATED" })
        if (!activeJobProposalStatusChange) {
            throw new AppError(JOB_MESSAGES.ACTIVE_JOB.UPDATION_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }

        return { message: PROPOSAL_MESSAGES.PROPOSAL.CREATION_SUCCESS, statuscode: RESPONSE_CODE.CREATED }
    }

    async getProposal(sourceId: string): Promise<IApiResponse<ProposalDetailDTO | null>> {
        const result = await this._proposalRepo.getProposal(sourceId)
        if (!result) {
            return { message: PROPOSAL_MESSAGES.PROPOSAL.NOT_FOUND, data: null }
        }
        const proposalData = ProposalMapper.toProposalDetailDTO(result)
        return { message: PROPOSAL_MESSAGES.PROPOSAL.FETCH_SUCCESS, data: proposalData, statuscode: RESPONSE_CODE.CREATED }
    }


    async getProposalInputForJobRequest(id: string): Promise<IApiResponse<ProposalInputData>> {

        const job = await this._jobRepo.getJobRequest(id);
        console.log(job)
        if (!job) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.NOT_FOUND, RESPONSE_CODE.BAD_REQUEST)
        }
        const proposalData = JobRequestMapper.toJobRequestProposalInputDTO(job)
        return { message: PROPOSAL_MESSAGES.PROPOSAL.TEMPLATE_FETCH_SUCCESS, data: proposalData }
    }

    async getProposalTemplateForDirecHire(id: string): Promise<IApiResponse<ProposalInputData>> {
        const job = await this._directHireRepo.getHireDesignerByJobId(id);
        if (!job) {
            throw new AppError(JOB_MESSAGES.HIRE_DESIGNER.NOT_FOUND, RESPONSE_CODE.BAD_REQUEST)
        }
        const proposalData = HireDesignerMapper.toDirectHireProposalInputDTO(job)
        return { message: PROPOSAL_MESSAGES.PROPOSAL.TEMPLATE_FETCH_SUCCESS, data: proposalData }
    }

    async approveOrRejectProposal(data: ProposalAcceptOrRejectDTO): Promise<IApiResponse<"Accepted" | "Rejected">> {
        const result = await this._proposalRepo.getProposal(data.sourceId)
        if (!result) {
            throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.NOT_FOUND, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
   
        const updated = await this._proposalRepo.acceptOrRejectProposal(data.sourceId, data.contractStatus, data.overallRejectionReason)
        if (!updated) {
            throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.STATUS_UPDATION_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }

        return { message: PROPOSAL_MESSAGES.PROPOSAL.STATUS_CHANGED, data: data.contractStatus }
    }
}