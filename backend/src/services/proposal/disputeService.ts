import type { AcceptOrRejectDisputeDTO, DisputeRaiseDTO, DisputeRepoDTO, DisputeResponseDTO } from "../../DTO/proposal/dispute";
import { DisputeMapper } from "../../dtoMappers/proposal/disputeMapper";
import type { IUserRepository } from "../../interfaces/auth/IUserRepository";
import type { IApiResponse } from "../../interfaces/base/IApiResponse";
import type { IImageUploaderService, ImageUploadResult } from "../../interfaces/base/IImageUpload";
import type { ITransactionRepository } from "../../interfaces/base/ITransaction";
import type { IActiveJobRepository, IJobRepository } from "../../interfaces/customer/ICustomerRepository";
import type { IDisputeRepository, IDisputeService } from "../../interfaces/proposal/IDispute";
import type { DisputeStatus } from "../../interfaces/proposal/IProposal";
import type { IProposalRepository } from "../../interfaces/proposal/IProposalRepository";
import { ACTIVE_JOB_STATUS, CLOUDINARY_FOLDER_NAME, JOB_REQUEST_STATUS, TRANSACTION_TYPE, TRANSACTION_UNIQUE_ID, USER_ROLES } from "../../shared/enums/commonEnums";
import { CONTRACT_STATUS, DISPUTE_SOLUTION, DISPUTE_STATUS, EscrowStatus, USER_TYPE } from "../../shared/enums/proposalEnums";
import { RESPONSE_CODE } from "../../shared/enums/statusCode";
import { AppError } from "../../shared/errors/appError";
import { generateUniqueId } from "../../shared/helpers/extraFunctions";
import { ADMIN_MESSAGES } from "../../shared/messages/adminMessages";
import { AUTH_MESSAGES } from "../../shared/messages/authMessages";
import { PROPOSAL_MESSAGES } from "../../shared/messages/proposalMessages";

export class DisputeService implements IDisputeService {
    constructor(private _jobRepo: IJobRepository, private _activeJobRepo: IActiveJobRepository, private _transactionRepo: ITransactionRepository, private _userRepo: IUserRepository, private _propsalRepo: IProposalRepository, private _imageUploder: IImageUploaderService, private _disputeRepo: IDisputeRepository) { }

    async getAllDisputePerProposal(proposalId: string): Promise<IApiResponse<DisputeResponseDTO[]>> {
        const proposal = await this._propsalRepo.getProposalbyId(proposalId)
        if (!proposal) {
            throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        const disputes = await this._disputeRepo.getAllDispute(proposalId)
        const disputeData = DisputeMapper.toDisputeDTOList(disputes)
        return { message: PROPOSAL_MESSAGES.DISPUTE.FETCH_ALL, data: disputeData }
    }

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
        const dispute = await this._disputeRepo.findDispute(data.disputeId);
        if (!dispute) {
            throw new AppError(PROPOSAL_MESSAGES.DISPUTE.NOT_FOUND, RESPONSE_CODE.NOT_FOUND);
        }
        
        if (dispute.status !== DISPUTE_STATUS.AWAITING_CONFIRMATION) {
            throw new AppError(PROPOSAL_MESSAGES.DISPUTE.DECISION_PENDING, RESPONSE_CODE.BAD_REQUEST);
        }
        
        const claimed = await this._disputeRepo.updateDisputeIfStatus(
            data.disputeId,
            DISPUTE_STATUS.AWAITING_CONFIRMATION,
            { status: data.status }
        );

        if (!claimed) {
            throw new AppError(PROPOSAL_MESSAGES.DISPUTE.DECISION_PENDING, RESPONSE_CODE.BAD_REQUEST);
        }

        if (data.status === DISPUTE_STATUS.RESOLVED || data.status === DISPUTE_STATUS.TERMINATED) {
            const isMonetary = dispute.resolutionType === DISPUTE_SOLUTION.REFUND || dispute.resolutionType === DISPUTE_SOLUTION.FULL_REFUND;

            if (isMonetary) {
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
                if (serviceEscrow.status === EscrowStatus.RELEASED) {

                    throw new AppError(PROPOSAL_MESSAGES.DISPUTE.PAYMENT_ALREADY_SETTLED, RESPONSE_CODE.BAD_REQUEST);
                }

                const isCustomerRaised = dispute.raisedBy === USER_TYPE.CUSTOMER;
                const reporterId = isCustomerRaised ? dispute.customerId.id : dispute.designerId.id;
                const reporterLabel = isCustomerRaised ? USER_ROLES.CUSTOMER : USER_ROLES.DESIGNER;

                const reporter = await this._userRepo.findUserById(reporterId);
                if (!reporter) {
                    throw new AppError(AUTH_MESSAGES.USER.NOT_FOUND, RESPONSE_CODE.NOT_FOUND);
                }

                const admin = await this._userRepo.findByRole(USER_ROLES.ADMIN);
                if (!admin) {
                    throw new AppError(ADMIN_MESSAGES.ADMIN.NOT_FOUND, RESPONSE_CODE.NOT_FOUND);
                }

                if (!isCustomerRaised) {
                    const updatedAdminWallet = await this._userRepo.incrementWallet(admin.id, serviceEscrow.platformCommission);
                    if (!updatedAdminWallet) {
                        throw new AppError(PROPOSAL_MESSAGES.PAYMENT.PAYOUT_ADMIN_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
                    }

                    await this._transactionRepo.createTransaction({
                        sourceUserId: proposal.clientId.toString() ?? admin.id,
                        destinationUserId: admin.id,
                        amount: serviceEscrow.platformCommission,
                        TransactionId: generateUniqueId(TRANSACTION_UNIQUE_ID.COMMISSION),
                        type: TRANSACTION_TYPE.COMMISSION,
                        proposalId: proposal.id
                    });
                }

                let payoutAmount: number;
                if (isCustomerRaised) {
                    payoutAmount = dispute.refundAmount === undefined || dispute.refundAmount === null ? serviceEscrow.amountHeld : dispute.refundAmount;
                } else {
                    if (dispute.refundAmount === undefined || dispute.refundAmount === null) {
                        throw new AppError(PROPOSAL_MESSAGES.DISPUTE.PAYMENT_NOT_FOUND, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
                    }
                    payoutAmount = dispute.refundAmount;
                }

                if (payoutAmount > serviceEscrow.amountHeld) {
                    throw new AppError(PROPOSAL_MESSAGES.DISPUTE.INVALID_REFUND_AMOUNT, RESPONSE_CODE.BAD_REQUEST);
                }

                const updatedReporter = await this._userRepo.incrementWallet(reporterId, payoutAmount);
                if (!updatedReporter) {
                    const errorMessage = reporterLabel === USER_ROLES.CUSTOMER ? PROPOSAL_MESSAGES.PAYMENT.PAYOUT_CUSTOMER_FAILED : PROPOSAL_MESSAGES.PAYMENT.PAYOUT_DESIGNER_FAILED
                    throw new AppError(errorMessage, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
                }

                await this._transactionRepo.createTransaction({
                    sourceUserId: proposal.clientId.toString() ?? admin.id,
                    destinationUserId: reporterId,
                    amount: payoutAmount,
                    type: isCustomerRaised ? TRANSACTION_TYPE.REFUND : TRANSACTION_TYPE.PAYOUT,
                    TransactionId: generateUniqueId(
                        isCustomerRaised ? TRANSACTION_UNIQUE_ID.REFUND : TRANSACTION_UNIQUE_ID.PAYOUT
                    ),
                    proposalId: proposal.id
                });


                const escrowUpdated = await this._propsalRepo.changeEscrowStatus(proposal.sourceId.toString(), dispute.serviceOrder, EscrowStatus.RELEASED);
                if (!escrowUpdated) {
                    throw new AppError(PROPOSAL_MESSAGES.DISPUTE.UPDATION_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
                }
            }
        }

        if (data.status === DISPUTE_STATUS.RESOLVED) {
            const proposalStatusUpdated = await this._propsalRepo.updateProposal(
                dispute.proposalId.id,
                { contractStatus: CONTRACT_STATUS.ONGOING }
            );
            if (!proposalStatusUpdated) {
                throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.UPDATE_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
            }
        }
        if (data.status === DISPUTE_STATUS.TERMINATED) {
     
            const [proposalUpdated, activeJobUpdated, jobUpdated] = await Promise.all([
                this._propsalRepo.updateProposal(dispute.proposalId.id, { contractStatus: CONTRACT_STATUS.TERMINATED }),
                this._activeJobRepo.updateActiveJob(dispute.proposalId.sourceId.toString(), { status: ACTIVE_JOB_STATUS.TERMINATED }),
                this._jobRepo.changeStatus(dispute.proposalId.sourceId.toString(), JOB_REQUEST_STATUS.TERMINATED)
            ]);

         
            if (!proposalUpdated || !activeJobUpdated || !jobUpdated) {
                throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.UPDATE_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
            }
        }
        return { message: PROPOSAL_MESSAGES.DISPUTE.UPDATION_SUCCESS, data: data.status };
    }

}