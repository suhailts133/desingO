import type { CreateProposalDTO, CreateProposalRepoDataDTO, ProposalAcceptOrRejectDTO, ProposalDetailDTO, ProposalInputData, UpdateProposalDTO, UpdateProposalRepoDataDTO } from "../../DTO/proposal/proposal";
import { ProposalMapper } from "../../dtoMappers/proposal/proposalMapper";
import { HireDesignerMapper } from "../../dtoMappers/user/hireDesignerMapper";
import type { IApiResponse } from "../../interfaces/base/IApiResponse";
import type { IImageUploaderService, ImageUploadResult } from "../../interfaces/base/IImageUpload";
import type { IActiveJobRepository, IJobRepository } from "../../interfaces/customer/ICustomerRepository";
import type { IServiceItem } from "../../interfaces/proposal/IProposal";
import type { IProposalRepository, IServiceVersionRepository } from "../../interfaces/proposal/IProposalRepository";
import type { IProposalService } from "../../interfaces/proposal/IProposalService";
import { CLOUDINARY_FOLDER_NAME } from "../../shared/enums/commonEnums";
import { CONTRACT_STATUS } from "../../shared/enums/proposalEnums";
import { RESPONSE_CODE } from "../../shared/enums/statusCode";
import { AppError } from "../../shared/errors/appError";
import { calculatePlatformFee } from "../../shared/helpers/platformfeeCalculator";
import { validateServiceOrders } from "../../shared/helpers/proposalOrderCheck";
import { JOB_MESSAGES } from "../../shared/messages/jobMessages";
import { PROPOSAL_MESSAGES } from "../../shared/messages/proposalMessages";

export class ProposalService implements IProposalService {
    constructor(private _proposalRepo: IProposalRepository, private _activeRepo: IActiveJobRepository, private _jobRepo: IJobRepository, private _serviceVersionRepo: IServiceVersionRepository, private _imageUploder: IImageUploaderService) { }

    async uploadFloorPlan(proposalId: string, floorPlans: Express.Multer.File[]): Promise<IApiResponse> {
        const proposal = await this._proposalRepo.getProposalbyId(proposalId)
        if (!proposal) {
            throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.NOT_FOUND, RESPONSE_CODE.BAD_REQUEST)
        }
        if (!proposal.siteVisitingNeeded) {
            throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.SITE_VIST_NOT_NEEDED, RESPONSE_CODE.BAD_REQUEST)
        }
        const floorPlanfiles: ImageUploadResult[] = await this._imageUploder.uploadMany(floorPlans ?? [], CLOUDINARY_FOLDER_NAME.FLOOR_PLANS)
        const updatedProposal = await this._proposalRepo.updateProposal(proposalId, { floorPlan: floorPlanfiles })
        if (!updatedProposal) {
            throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.UPDATE_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        const openService = await this._proposalRepo.acceptOrRejectProposal(
            proposal.sourceId.toString(), CONTRACT_STATUS.ACCEPTED, true
        )
        if (!openService) {
            throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.STATUS_UPDATION_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
        }
        return { message: PROPOSAL_MESSAGES.PROPOSAL.FLOOR_PLAN_UPLOADED }
    }

    async createProposal(data: CreateProposalDTO): Promise<IApiResponse> {
        const activeJob = await this._activeRepo.getActiveJobBySource(data.sourceId);
        if (!activeJob) {
            throw new AppError(JOB_MESSAGES.ACTIVE_JOB.NOT_FOUND, RESPONSE_CODE.NOT_FOUND);
        }

        const proposal = await this._proposalRepo.getProposal(data.sourceId);
        if (proposal) {
            throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.EXISTS, RESPONSE_CODE.CONFILT);
        }
        const jobRequest = await this._jobRepo.getJobRequest(data.sourceId)
        if (!jobRequest) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.NOT_FOUND, RESPONSE_CODE.NOT_FOUND);
        }

        const expectedTotalDrawingFee = data.drawingFeePerSqFt * jobRequest.totalCarpetArea;
        const totalDrawingFee = data.services.reduce((acc, cur) => acc + cur.price, 0);
        validateServiceOrders(data.services);

        if (expectedTotalDrawingFee !== totalDrawingFee) {
            throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.PRICE_MISMATCH(expectedTotalDrawingFee, totalDrawingFee), RESPONSE_CODE.BAD_REQUEST);
        }

        const calculatedPlatformFee = calculatePlatformFee(totalDrawingFee);
        const totalExecutionFee = data.services.reduce((acc, cur) => acc + cur.executionPrice, 0);
        const totalContractValue = totalDrawingFee + totalExecutionFee;

        const repoData: CreateProposalRepoDataDTO = {
            ...data,
            clientId: activeJob.userId.toString(),
            designerId: activeJob.designerId.toString(),
            totalDrawingFee,
            platformFee: calculatedPlatformFee,
            remainingPlatformFee: calculatedPlatformFee,
            totalExecutionFee,
            unit: jobRequest.areaUnit,
            totalArea: jobRequest.totalCarpetArea,
            totalContractValue,
            currentAmountHeld: 0,
            sourceName: activeJob.sourceName,
            services: data.services as unknown as IServiceItem[]
        };

        const result = await this._proposalRepo.createProposal(repoData);
        if (!result) {
            throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.CREATION_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
        }

        await this._activeRepo.updateActiveJob(data.sourceId, { proposalStatus: "CREATED" });

        return { message: PROPOSAL_MESSAGES.PROPOSAL.CREATION_SUCCESS, statuscode: RESPONSE_CODE.CREATED };
    }

    async updateProposal(data: UpdateProposalDTO): Promise<IApiResponse> {

        const { proposalId, sourceId, ...rest } = data
        const jobRequest = await this._jobRepo.getJobRequest(sourceId)
        if (!jobRequest) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        const proposal = await this._proposalRepo.getProposalbyId(proposalId)
        if (!proposal) {
            throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        if (proposal.contractStatus !== CONTRACT_STATUS.REJECTED) {
            throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.UPDATE_NOT_REJECTED, RESPONSE_CODE.BAD_REQUEST)
        }
        const expectedTotalDrawingFee = rest.drawingFeePerSqFt * jobRequest.totalCarpetArea;
        const totalDrawingFee = data.services.reduce((acc, cur) => acc + cur.price, 0);
        validateServiceOrders(data.services);

        if (expectedTotalDrawingFee !== totalDrawingFee) {
            throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.PRICE_MISMATCH(expectedTotalDrawingFee, totalDrawingFee), RESPONSE_CODE.BAD_REQUEST);
        }

        const calculatedPlatformFee = calculatePlatformFee(totalDrawingFee);
        const totalExecutionFee = data.services.reduce((acc, cur) => acc + cur.executionPrice, 0);
        const totalContractValue = totalDrawingFee + totalExecutionFee;
        const repoData: UpdateProposalRepoDataDTO = {
            services: rest.services as unknown as IServiceItem[],
            totalDrawingFee,
            platformFee: calculatedPlatformFee,
            remainingPlatformFee: calculatedPlatformFee,
            totalExecutionFee,
            unit: jobRequest.areaUnit,
            totalArea: jobRequest.totalCarpetArea,
            totalContractValue,
            contractStatus: CONTRACT_STATUS.SENT,
            overallRejectionReason: "",
            siteVisitingNeeded: rest.siteVisitingNeeded,
            ...(rest.expectedSiteVisitingDate && { expectedSiteVisitingDate: rest.expectedSiteVisitingDate, }),
            expectedCompletionDate: rest.expectedCompletionDate

        }
        const result = await this._proposalRepo.updateProposal(proposalId, repoData);
        if (!result) {
            throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.UPDATE_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        return { message: PROPOSAL_MESSAGES.PROPOSAL.UPDATE_SUCCESS }
    }


    async getProposal(sourceId: string): Promise<IApiResponse<ProposalDetailDTO | null>> {
        const result = await this._proposalRepo.getProposal(sourceId)
        if (!result) {
            return { message: PROPOSAL_MESSAGES.PROPOSAL.NOT_FOUND, data: null }
        }
        const allVersions = await this._serviceVersionRepo.findAllVersions(sourceId)

        const proposalData = ProposalMapper.toProposalDetailDTO(result, allVersions)
        return { message: PROPOSAL_MESSAGES.PROPOSAL.FETCH_SUCCESS, data: proposalData, statuscode: RESPONSE_CODE.CREATED }
    }



    async getProposalTemplate(id: string): Promise<IApiResponse<ProposalInputData>> {
        const job = await this._jobRepo.getJobRequest(id);
        if (!job) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.NOT_FOUND, RESPONSE_CODE.BAD_REQUEST)
        }
        const proposalData = HireDesignerMapper.toDirectHireProposalInputDTO(job)
        return { message: PROPOSAL_MESSAGES.PROPOSAL.TEMPLATE_FETCH_SUCCESS, data: proposalData }
    }


    async approveOrRejectProposal(data: ProposalAcceptOrRejectDTO): Promise<IApiResponse<"Accepted" | "Rejected">> {
        const proposal = await this._proposalRepo.getProposal(data.sourceId);
        if (!proposal) {
            throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.NOT_FOUND, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
        }


        const isSaleVisiting = proposal.siteVisitingNeeded === true;
        const hasFloorPlans = Array.isArray(proposal.floorPlan) && proposal.floorPlan.length > 0;
        const shouldUpdateServiceStatus = isSaleVisiting && hasFloorPlans;

        const updated = await this._proposalRepo.acceptOrRejectProposal(
            data.sourceId,
            data.contractStatus,
            shouldUpdateServiceStatus,
            data.overallRejectionReason
        );

        if (!updated) {
            throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.STATUS_UPDATION_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
        }

        return { message: PROPOSAL_MESSAGES.PROPOSAL.STATUS_CHANGED, data: data.contractStatus };
    }
}