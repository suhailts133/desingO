import Logger from "../../config/logger";
import type { VersionAcceptOrRejectDTO } from "../../DTO/proposal/version";
import type { IUserRepository } from "../../interfaces/auth/IUserRepository";
import type { IApiResponse } from "../../interfaces/base/IApiResponse";
import type { IImageUploaderService, ImageUploadResult } from "../../interfaces/base/IImageUpload";
import type { IProposalRepository, IServiceVersionRepository } from "../../interfaces/proposal/IProposalRepository";
import type { IProposalVersionService } from "../../interfaces/proposal/IProposalService";
import { CLOUDINARY_FOLDER_NAME, USER_ROLES } from "../../shared/enums/commonEnums";
import { CONTRACT_STATUS, ServicePaymentStatus, ServiceStatus, VERSION_STATUS } from "../../shared/enums/proposalEnums";
import { RESPONSE_CODE } from "../../shared/enums/statusCode";
import { AppError } from "../../shared/errors/appError";
import { ADMIN_MESSAGES } from "../../shared/messages/adminMessages";
import { PROPOSAL_MESSAGES } from "../../shared/messages/proposalMessages";

export class ProposalVersionService implements IProposalVersionService {
    constructor(private _proposalRepo: IProposalRepository, private _serviceVersionRepo: IServiceVersionRepository, private _imageUploder: IImageUploaderService, private _userRepo: IUserRepository) { }

    async uploadProposalImage(sourceId: string, ServiceNumber: number, serviceImages: Express.Multer.File[]): Promise<IApiResponse> {
        Logger.info(`${ServiceNumber} service from the controller`)
        const proposal = await this._proposalRepo.getProposal(sourceId)
        if (!proposal) {
            throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }

        const service = proposal.services.find(s => s.order === Number(ServiceNumber) && (s.status === ServiceStatus.IN_PROGRESS || s.status === ServiceStatus.REDO))
        if (!service) {
            throw new AppError(PROPOSAL_MESSAGES.SERVICE.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        if (service.paymentStatus === ServicePaymentStatus.PENDING) {
            throw new AppError(PROPOSAL_MESSAGES.SERVICE.NOT_PAID, RESPONSE_CODE.CONFILT)
        }
        Logger.info(`${service.order} service order in the service`)
        const currntVersion = service.currentVersion
        const images: ImageUploadResult[] = await this._imageUploder.uploadMany(serviceImages ?? [], CLOUDINARY_FOLDER_NAME.SERVICE_RESULT)
        const versionResult = await this._serviceVersionRepo.createVersion({
            proposalId: proposal.id,
            sourceId: proposal.sourceId.toString(),
            version: currntVersion + 1,
            images,
            serviceOrder: service.order
        })
        if (!versionResult) {
            throw new AppError("version createion failed", RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }

        const updatedServiceVersion = await this._proposalRepo.updateServiceVersion(sourceId, Number(ServiceNumber), ServiceStatus.UPLOADED, versionResult.version)
        if (!updatedServiceVersion) {
            throw new AppError(PROPOSAL_MESSAGES.SERVICE.UPDATE_FAIL, RESPONSE_CODE.NOT_FOUND)
        }

        return { message: PROPOSAL_MESSAGES.SERVICE.SUCCESS }
    }

    async acceptOrRejectVersion(data: VersionAcceptOrRejectDTO): Promise<IApiResponse> {
        const version = await this._serviceVersionRepo.findVersion(data.versionId)
        if (!version) {
            throw new AppError(PROPOSAL_MESSAGES.VERSION.NOT_FOUND, RESPONSE_CODE.BAD_REQUEST)
        }
        const proposal = await this._proposalRepo.getProposal(version.sourceId.toString())
        if (!proposal) {
            throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        const service = proposal.services.find(e => e.order === version.serviceOrder);
        if (!service) {
            throw new AppError(PROPOSAL_MESSAGES.SERVICE.NOT_FOUND, RESPONSE_CODE.BAD_REQUEST)
        }
        const updatedVersion = await this._serviceVersionRepo.acceptOrRejectVersion(data)
        if (!updatedVersion) {
            throw new AppError(PROPOSAL_MESSAGES.VERSION.UPDATE_FAIL, RESPONSE_CODE.NOT_FOUND)
        }

        const paymentDetails = service.escrow
        if (!paymentDetails) {
            throw new AppError(PROPOSAL_MESSAGES.ESCROW.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }


        if (updatedVersion.status === VERSION_STATUS.APPROVED) {
            const updateCurrentServiceStatus = await this._proposalRepo.acceptOrRejectServiceResult(proposal.sourceId.toString(), service.order, ServiceStatus.COMPLETED)
            if (!updateCurrentServiceStatus) {
                throw new AppError(PROPOSAL_MESSAGES.SERVICE.CANNOT_COMPLETE, RESPONSE_CODE.NOT_FOUND)
            }

            const designerAmount = paymentDetails.designerPayout
            const platformFee = paymentDetails.platformCommission

            const designerNewWalletAmount = proposal.designerId.wallet + designerAmount
            const updatedWalletDesigner = await this._userRepo.updateUser(proposal.designerId.id, { wallet: designerNewWalletAmount })
            if (!updatedWalletDesigner) {
                throw new AppError(PROPOSAL_MESSAGES.PAYMENT.PAYOUT_DESIGNER_FAILED, RESPONSE_CODE.NOT_FOUND)
            }

            const admin = await this._userRepo.findByRole(USER_ROLES.ADMIN)
            if (!admin) {
                throw new AppError(ADMIN_MESSAGES.ADMIN.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
            }
            const adminNewWalletAmount = admin.wallet + platformFee
            const updatedAdminWallet = await this._userRepo.updateUser(admin.id, { wallet: adminNewWalletAmount })
            if (!updatedAdminWallet) {
                throw new AppError(PROPOSAL_MESSAGES.PAYMENT.PAYOUT_ADMIN_FAILED, RESPONSE_CODE.NOT_FOUND)
            }
            const newService = proposal.services.find(e => e.order === updatedVersion.serviceOrder + 1)
            if (newService) {
                const updatedProposal = await this._proposalRepo.acceptOrRejectServiceResult(proposal.sourceId.toString(), newService.order, ServiceStatus.OPEN)
                if (!updatedProposal) {
                    throw new AppError(PROPOSAL_MESSAGES.SERVICE.CANNOT_OPEN, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
                }
                return { message: PROPOSAL_MESSAGES.VERSION.UPDATE_SUCCESS }
            }

            const completedCount = proposal.services.filter(e => e.order !== service.order && e.status === ServiceStatus.COMPLETED).length
            const allCompleted = completedCount === proposal.services.length - 1

            if (allCompleted) {
                const updateContractStatus = await this._proposalRepo.updateProposal(proposal.id, { contractStatus: CONTRACT_STATUS.COMPLETED })
                if (!updateContractStatus) {
                    throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.CONTRACT_STATUS_FAIL, RESPONSE_CODE.BAD_REQUEST)
                }
            }
            return { message: PROPOSAL_MESSAGES.VERSION.UPDATE_SUCCESS }
        }

        const rejectService = await this._proposalRepo.acceptOrRejectServiceResult(proposal.sourceId.toString(), service.order, ServiceStatus.REDO)
        if (!rejectService) {
            throw new AppError(PROPOSAL_MESSAGES.SERVICE.UPDATE_FAIL, RESPONSE_CODE.BAD_REQUEST)
        }

        return { message: PROPOSAL_MESSAGES.VERSION.UPDATE_SUCCESS }

    }
}