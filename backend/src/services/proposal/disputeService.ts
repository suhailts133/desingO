import type { AcceptOrRejectDisputeDTO, DisputeRaiseDTO, DisputeRepoDTO, DisputeResponseDTO } from "../../DTO/proposal/dispute";
import { DisputeMapper } from "../../dtoMappers/proposal/disputeMapper";
import type { IApiResponse } from "../../interfaces/base/IApiResponse";
import type { IImageUploaderService, ImageUploadResult } from "../../interfaces/base/IImageUpload";
import type { IDisputeRepository, IDisputeService } from "../../interfaces/proposal/IDispute";
import type { DisputeStatus } from "../../interfaces/proposal/IProposal";
import type { IProposalRepository } from "../../interfaces/proposal/IProposalRepository";
import { CLOUDINARY_FOLDER_NAME } from "../../shared/enums/commonEnums";
import { CONTRACT_STATUS, DISPUTE_STATUS, USER_TYPE } from "../../shared/enums/proposalEnums";
import { RESPONSE_CODE } from "../../shared/enums/statusCode";
import { AppError } from "../../shared/errors/appError";
import { PROPOSAL_MESSAGES } from "../../shared/messages/proposalMessages";

export class DisputeService implements IDisputeService {
    constructor(private _propsalRepo: IProposalRepository, private _imageUploder: IImageUploaderService, private _disputeRepo: IDisputeRepository) { }

    async getDispute(proposalId: string): Promise<IApiResponse<DisputeResponseDTO>> {
        const proposal = await this._propsalRepo.getProposalbyId(proposalId)
        if (!proposal) {
            throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        if (proposal.contractStatus !== CONTRACT_STATUS.DISPUTED) {
            throw new AppError(PROPOSAL_MESSAGES.DISPUTE.NOT_DISPUTED, RESPONSE_CODE.CONFILT)
        }
        const disputId = proposal.disputeId
        const dispute = await this._disputeRepo.findDispute(disputId)
        if (!dispute) {
            throw new AppError(PROPOSAL_MESSAGES.DISPUTE.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        const disputeData = DisputeMapper.toDisputeResponseDTO(dispute, proposal.contractStatus)
        return { message: PROPOSAL_MESSAGES.DISPUTE.SUCCESS, data: disputeData }
    }

    async createDispute(data: DisputeRaiseDTO, reporterId: string): Promise<IApiResponse<DisputeResponseDTO>> {
        const proposal = await this._propsalRepo.getProposal(data.sourceId);
        if (!proposal) {
            throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        if (proposal.contractStatus === CONTRACT_STATUS.DISPUTED) {
            throw new AppError(PROPOSAL_MESSAGES.DISPUTE.ONGOING, RESPONSE_CODE.CONFILT)
        }


        const current_service = proposal.services.find(service => service.order === Number(data.order))
        if (!current_service) {
            throw new AppError(PROPOSAL_MESSAGES.SERVICE.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }

        const evidence: ImageUploadResult[] = await this._imageUploder.uploadMany(data.evidence, CLOUDINARY_FOLDER_NAME.EVIDENCE)

        let raisedBy: "Customer" | "Designer";
        let customerId: string;
        let designerId: string;
        if (proposal.clientId.id === reporterId) {
            raisedBy = USER_TYPE.CUSTOMER
            customerId = reporterId
            designerId = proposal.designerId.id
        } else {
            raisedBy = USER_TYPE.DESIGNER
            customerId = proposal.clientId.id
            designerId = reporterId
        }

        const repoData: DisputeRepoDTO = {
            proposalId: proposal.id,
            raisedBy,
            type: data.type,
            customerId,
            designerId,
            reason: data.reason,
            evidence,
            serviceOrder: Number(data.order)
        }

        const dispute = await this._disputeRepo.createDispute(repoData)
        const proposalUpdated = await this._propsalRepo.updateProposal(proposal.id, { disputeId: dispute.id, contractStatus: CONTRACT_STATUS.DISPUTED })
        if (!proposalUpdated) {
            throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.STATUS_UPDATION_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        const disputeData = DisputeMapper.toDisputeResponseDTO(dispute, proposalUpdated.contractStatus)
        return { message: PROPOSAL_MESSAGES.DISPUTE.SUCCESS, data: disputeData }
    }


    async AcceptOrRejectDispute(data: AcceptOrRejectDisputeDTO): Promise<IApiResponse<DisputeStatus>> {
        const dispute = await this._disputeRepo.findDispute(data.disputeId)
        if (!dispute) {
            throw new AppError(PROPOSAL_MESSAGES.DISPUTE.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        if (dispute.status !== DISPUTE_STATUS.AWAITING_CONFIRMATION) {
            throw new AppError(PROPOSAL_MESSAGES.DISPUTE.DECISION_PENDING, RESPONSE_CODE.BAD_REQUEST)
        }
        const updatedDispute = await this._disputeRepo.updateDispute(data.disputeId, { status: data.status })
        if (!updatedDispute) {
            throw new AppError(PROPOSAL_MESSAGES.DISPUTE.UPDATION_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        if (updatedDispute.status === DISPUTE_STATUS.RESOLVED) {
            const proposalStatusUpdated = await this._propsalRepo.updateProposal(updatedDispute.proposalId.toString(), { contractStatus: CONTRACT_STATUS.ONGOING })
            if (!proposalStatusUpdated) {
                throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.UPDATE_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
            }
        }
        return { message: PROPOSAL_MESSAGES.DISPUTE.UPDATION_SUCCESS, data: updatedDispute.status }
    }
}