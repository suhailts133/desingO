import type { DisputeAdminFilters, AllDisputeAdminDTO, DisputeDetailAdminDTO, DisputeSolutionDTO, DisputeSolutionResponseDTO } from "../../DTO/proposal/dispute";
import { DisputeMapper } from "../../dtoMappers/proposal/disputeMapper";
import type { IAdminDisputeService } from "../../interfaces/admin/IDisputeService";
import type { IUserRepository } from "../../interfaces/auth/IUserRepository";
import type { IApiResponse, IApiResponseWithPagination } from "../../interfaces/base/IApiResponse";
import type { ITransactionRepository } from "../../interfaces/base/ITransaction";
import type { IDisputeRepository } from "../../interfaces/proposal/IDispute";
import type { IProposalRepository } from "../../interfaces/proposal/IProposalRepository";
import { TRANSACTION_TYPE, USER_ROLES } from "../../shared/enums/commonEnums";
import { DISPUTE_SOLUTION, DISPUTE_STATUS } from "../../shared/enums/proposalEnums";
import { RESPONSE_CODE } from "../../shared/enums/statusCode";
import { AppError } from "../../shared/errors/appError";
import { ADMIN_MESSAGES } from "../../shared/messages/adminMessages";
import { AUTH_MESSAGES } from "../../shared/messages/authMessages";
import { PROPOSAL_MESSAGES } from "../../shared/messages/proposalMessages";



/**
 * Service handling admin-level dispute resolution workflows.
 * 
 * Manages fetching dispute logs, retrieving full context for individual disputes,
 */
export class DisputeManagementService implements IAdminDisputeService {
    constructor(private _transactionRepo: ITransactionRepository, private _disputeRepo: IDisputeRepository, private _proposalRepo: IProposalRepository, private _userRepo: IUserRepository) { }


    /**
  * Fetches a paginated list of all disputes for admin management.
  * 
  * @param filter - Optional filter parameters (e.g., status, page, sort).
  * @returns Paginated list of dispute summary DTOs.
  */
    async getAllDispute(filter?: DisputeAdminFilters): Promise<IApiResponseWithPagination<AllDisputeAdminDTO[]>> {
        const { data, pagination } = await this._disputeRepo.getAllDispute(filter)
        const disputeData = DisputeMapper.toAdminDisputeDTOList(data)
        return { message: PROPOSAL_MESSAGES.DISPUTE.FETCH_ALL, total: pagination.total, totalPages: pagination.totalPages, data: disputeData }
    }

    /**
     *  Fetches full details for a specific dispute.
     * @param id  - Unique identifier of the dispute
     * @returns Detailed dispute data
     * @throws {AppError} 404 - If the dispute, asssosiated proposal or the service not found
     */
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


    /**
  * Processes and applies a resolution for an open dispute.
  * 
  * - Validates the refund amounts against escrow metrics (`designerPayout`).
  * - Distributes funds dynamically: transfers platform commissions to the admin 
  *   and refunds the reporter (customer or designer) if applicable.
  * - Updates the dispute status to `AWAITING_CONFIRMATION`.
  * 
  * @param data - Resolution payload containing solution type, refund amount, and notes.
  * @returns Resolution summary status.
  * @throws {AppError} 409 - If refund amount is negative or exceeds available escrow.
  * @throws {AppError} 404 - If dispute, associated escrow, admin user, or reporter is not found.
  * @throws {AppError} 500 - If updating wallets or dispute state fails.
  */
    async disputeSolution(data: DisputeSolutionDTO): Promise<IApiResponse<DisputeSolutionResponseDTO>> {
        if (data.refundAmount < 0) {
            throw new AppError(PROPOSAL_MESSAGES.DISPUTE.ZERO, RESPONSE_CODE.BAD_REQUEST);
        }

        const dispute = await this._disputeRepo.findDispute(data.disputeId);
        if (!dispute) {
            throw new AppError(PROPOSAL_MESSAGES.DISPUTE.NOT_FOUND, RESPONSE_CODE.NOT_FOUND);
        }

        const proposal = dispute.proposalId;
        if (!proposal || !proposal.services) {
            throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.NOT_FOUND, RESPONSE_CODE.NOT_FOUND);
        }

        const service = proposal.services.find((e) => e.order === dispute.serviceOrder);
        if (!service) {
            throw new AppError(PROPOSAL_MESSAGES.SERVICE.NOT_FOUND, RESPONSE_CODE.NOT_FOUND);
        }

        const serviceEscrow = service.escrow;
        if (!serviceEscrow) {
            throw new AppError(PROPOSAL_MESSAGES.DISPUTE.PAYMENT_NOT_FOUND, RESPONSE_CODE.NOT_FOUND);
        }

     
        const customerId = dispute.customerId?.id ?? dispute.customerId.id.toString() ?? dispute.customerId;

        let finalRefundAmount = 0;

        if (data.resolutionType === DISPUTE_SOLUTION.REFUND || data.resolutionType === DISPUTE_SOLUTION.FULL_REFUND) {
            finalRefundAmount = data.resolutionType === DISPUTE_SOLUTION.FULL_REFUND
                ? serviceEscrow.designerPayout
                : data.refundAmount;

            if (data.resolutionType === DISPUTE_SOLUTION.REFUND && finalRefundAmount >= serviceEscrow.designerPayout) {
                throw new AppError(PROPOSAL_MESSAGES.DISPUTE.REFEUND_EXCEEDS, RESPONSE_CODE.CONFILT);
            }

            const admin = await this._userRepo.findByRole(USER_ROLES.ADMIN);
            if (!admin) {
                throw new AppError(ADMIN_MESSAGES.ADMIN.NOT_FOUND, RESPONSE_CODE.NOT_FOUND);
            }

            const customer = await this._userRepo.findUserById(customerId);
            if (!customer) {
                throw new AppError(AUTH_MESSAGES.USER.NOT_FOUND, RESPONSE_CODE.NOT_FOUND);
            }

            
            const updatedAdminWallet = await this._userRepo.updateUser(admin.id, {
                wallet: admin.wallet + serviceEscrow.platformCommission
            });
            if (!updatedAdminWallet) {
                throw new AppError(PROPOSAL_MESSAGES.PAYMENT.PAYOUT_ADMIN_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
            }

            await this._transactionRepo.createTransaction({
                sourceUserId: admin.id,
                destinationUserId: admin.id,
                amount: serviceEscrow.platformCommission,
                type: TRANSACTION_TYPE.COMMISSION,
                proposalId: proposal.id 
            });

         
            const updatedCustomer = await this._userRepo.updateUser(customerId, {
                wallet: customer.wallet + finalRefundAmount
            });
            if (!updatedCustomer) {
                throw new AppError(PROPOSAL_MESSAGES.PAYMENT.PAYOUT_DESIGNER_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
            }

            await this._transactionRepo.createTransaction({
                sourceUserId: admin.id,
                destinationUserId: customerId,
                amount: finalRefundAmount,
                type: TRANSACTION_TYPE.REFUND,
                proposalId: proposal.id ?? proposal.id ?? proposal
            });
        }

        const updatedDispute = await this._disputeRepo.updateDispute(data.disputeId, {
            resolution: data.resolution,
            refundAmount: finalRefundAmount,
            resolutionType: data.resolutionType,
            status: DISPUTE_STATUS.AWAITING_CONFIRMATION
        });

        if (!updatedDispute) {
            throw new AppError(PROPOSAL_MESSAGES.DISPUTE.UPDATION_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
        }

        const responseData: DisputeSolutionResponseDTO = {
            refundAmount: finalRefundAmount,
            resolution: data.resolution,
            resolutionType: data.resolutionType,
            disputeId: updatedDispute.id,
            status: updatedDispute.status
        };

        return { message: PROPOSAL_MESSAGES.DISPUTE.UPDATION_SUCCESS, data: responseData };
    }

}