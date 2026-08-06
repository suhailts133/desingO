import type { DisputeAdminFilters, AllDisputeAdminDTO, DisputeDetailAdminDTO, DisputeSolutionDTO, DisputeSolutionResponseDTO } from "../../DTO/proposal/dispute";
import { DisputeMapper } from "../../dtoMappers/proposal/disputeMapper";
import type { IAdminDisputeService } from "../../interfaces/admin/IDisputeService";
import type { IUserRepository } from "../../interfaces/auth/IUserRepository";
import type { IApiResponse, IApiResponseWithPagination } from "../../interfaces/base/IApiResponse";
import type { IDisputeRepository } from "../../interfaces/proposal/IDispute";
import type { IProposalRepository } from "../../interfaces/proposal/IProposalRepository";
import { USER_ROLES } from "../../shared/enums/commonEnums";
import { DISPUTE_SOLUTION, DISPUTE_STATUS, USER_TYPE } from "../../shared/enums/proposalEnums";
import { RESPONSE_CODE } from "../../shared/enums/statusCode";
import { AppError } from "../../shared/errors/appError";
import { ADMIN_MESSAGES } from "../../shared/messages/adminMessages";
import { AUTH_MESSAGES } from "../../shared/messages/authMessages";
import { PROPOSAL_MESSAGES } from "../../shared/messages/proposalMessages";

export class DisputeManagementService implements IAdminDisputeService {
    constructor(private _disputeRepo: IDisputeRepository, private _proposalRepo: IProposalRepository, private _userRepo: IUserRepository) { }

    async getAllDispute(filter?: DisputeAdminFilters): Promise<IApiResponseWithPagination<AllDisputeAdminDTO[]>> {
        const { data, pagination } = await this._disputeRepo.getAllDispute(filter)
        const disputeData = DisputeMapper.toAdminDisputeDTOList(data)
        return { message: PROPOSAL_MESSAGES.DISPUTE.FETCH_ALL, total: pagination.total, totalPages: pagination.totalPages, data: disputeData }
    }

    async getDisputeDetail(id: string): Promise<IApiResponse<DisputeDetailAdminDTO>> {
        const dispute = await this._disputeRepo.findDispute(id)
        if (!dispute) {
            throw new AppError(PROPOSAL_MESSAGES.DISPUTE.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        const proposal = await this._proposalRepo.getProposalbyId(dispute.proposalId.id)
        if (!proposal) {
            throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        const service = proposal.services.find(e => e.order === dispute.serviceOrder)
        if (!service) {
            throw new AppError(PROPOSAL_MESSAGES.SERVICE.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        const disputeData = DisputeMapper.toAdminDisputeDTO(dispute, service)
        return { message: PROPOSAL_MESSAGES.DISPUTE.FETCH_ONE, data: disputeData }
    }


    async disputeSolution(data: DisputeSolutionDTO): Promise<IApiResponse<DisputeSolutionResponseDTO>> {
        if (data.refundAmount < 0) {
            throw new AppError(PROPOSAL_MESSAGES.DISPUTE.ZERO, RESPONSE_CODE.CONFILT);
        }
        const dispute = await this._disputeRepo.findDispute(data.disputeId);
        if (!dispute) {
            throw new AppError(PROPOSAL_MESSAGES.DISPUTE.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        const service = dispute.proposalId.services.find(e => e.order === dispute.serviceOrder)
        if (!service) {
            throw new AppError(PROPOSAL_MESSAGES.SERVICE.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        let reporterId: string
        if (dispute.raisedBy === USER_TYPE.CUSTOMER) {
            reporterId = dispute.customerId.id
        } else {
            reporterId = dispute.designerId.id
        }
        const serviceEscrow = service.escrow;
        if (!serviceEscrow) {
            throw new AppError(PROPOSAL_MESSAGES.DISPUTE.PAYMENT_NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        if (data.resolutionType === DISPUTE_SOLUTION.REFUND || data.resolutionType === DISPUTE_SOLUTION.FULL_REFUND) {
            const admin = await this._userRepo.findByRole(USER_ROLES.ADMIN);
            if (!admin) {
                throw new AppError(ADMIN_MESSAGES.ADMIN.NOT_FOUND, RESPONSE_CODE.NOT_FOUND);
            }

            const reporter = await this._userRepo.findUserById(reporterId);
            if (!reporter) {
                throw new AppError(AUTH_MESSAGES.USER.NOT_FOUND, RESPONSE_CODE.NOT_FOUND);
            }

            const refundAmount = data.resolutionType === DISPUTE_SOLUTION.FULL_REFUND ? serviceEscrow.designerPayout : data.refundAmount;

            if (data.resolutionType === DISPUTE_SOLUTION.REFUND && refundAmount >= serviceEscrow.designerPayout) {
                throw new AppError(PROPOSAL_MESSAGES.DISPUTE.REFEUND_EXCEEDS, RESPONSE_CODE.CONFILT);
            }

            const updatedAdminWallet = await this._userRepo.updateUser(admin.id, { wallet: admin.wallet + serviceEscrow.platformCommission });

            if (!updatedAdminWallet) {
                throw new AppError(PROPOSAL_MESSAGES.PAYMENT.PAYOUT_ADMIN_FAILED, RESPONSE_CODE.NOT_FOUND);
            }

            const updatedReporter = await this._userRepo.updateUser(reporterId, { wallet: reporter.wallet + refundAmount });

            if (!updatedReporter) {
                throw new AppError(PROPOSAL_MESSAGES.PAYMENT.PAYOUT_DESIGNER_FAILED, RESPONSE_CODE.NOT_FOUND);
            }
        }
        const updatedDispute = await this._disputeRepo.updateDispute(data.disputeId, {
            resolution: data.resolution,
            refundAmount: data.refundAmount,
            resolutionType: data.resolutionType,
            status: DISPUTE_STATUS.AWAITING_CONFIRMATION
        })
        if (!updatedDispute) {
            throw new AppError(PROPOSAL_MESSAGES.DISPUTE.UPDATION_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        const responseData: DisputeSolutionResponseDTO = {
            refundAmount: data.refundAmount,
            resolution: data.resolution,
            resolutionType: data.resolutionType,
            disputeId: updatedDispute.id,
            status: updatedDispute.status
        }

        return { message: PROPOSAL_MESSAGES.DISPUTE.UPDATION_SUCCESS, data: responseData }
    }

}