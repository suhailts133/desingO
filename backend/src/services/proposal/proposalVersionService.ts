import Logger from "../../config/logger.js";
import type { ServiceImageUploadResponseDTO } from "../../DTO/proposal/proposal.js";
import type { VersionAcceptOrRejectDTO } from "../../DTO/proposal/version.js";
import type { IUserRepository } from "../../interfaces/auth/IUserRepository.js";
import type { IApiResponse } from "../../interfaces/base/IApiResponse.js";
import type { IImageUploaderService, ImageUploadResult } from "../../interfaces/base/IImageUpload.js";
import type { IProposalRepository, IServiceVersionRepository } from "../../interfaces/proposal/IProposalRepository.js";
import type { IProposalVersionService } from "../../interfaces/proposal/IProposalService.js";
import { CLOUDINARY_FOLDER_NAME, USER_ROLES } from "../../shared/enums/commonEnums.js";
import { CONTRACT_STATUS, ServiceStatus, VERSION_STATUS } from "../../shared/enums/proposalEnums.js";
import { RESPONSE_CODE } from "../../shared/enums/statusCode.js";
import { AppError } from "../../shared/errors/appError.js";
import { ADMIN_MESSAGES } from "../../shared/messages/adminMessages.js";
import { PROPOSAL_MESSAGES } from "../../shared/messages/proposalMessages.js";

export class ProposalVersionService implements IProposalVersionService {
    constructor(private _proposalRepo: IProposalRepository, private _serviceVersionRepo: IServiceVersionRepository, private _imageUploder: IImageUploaderService, private _userRepo: IUserRepository) { }

    async uploadProposalImage(sourceId: string, ServiceNumber: number, serviceImages: Express.Multer.File[]): Promise<IApiResponse> {
        const proposal = await this._proposalRepo.getProposal(sourceId)
        if (!proposal) {
            throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        const service = proposal.services.find(s => s.order === Number(ServiceNumber) && s.status === ServiceStatus.IN_PROGRESS)
        if (!service) {
            throw new AppError(PROPOSAL_MESSAGES.SERVICE.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        Logger.info(`service ${JSON.stringify(service)}`)
        const currntVersion = service.currentVersion
        const images: ImageUploadResult[] = await this._imageUploder.uploadMany(serviceImages ?? [], CLOUDINARY_FOLDER_NAME.SERVICE_RESULT)
        Logger.info(`images , ${JSON.stringify(images)}`)
        const versionResult = await this._serviceVersionRepo.createVersion({
            proposalId: proposal.id,
            sourceId:proposal.sourceId.toString(),
            version: currntVersion + 1,
            images,
            serviceOrder: service.order
        })
        if(!versionResult){
            throw new AppError("version createion failed", RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        Logger.info(`version created ${JSON.stringify(versionResult)}`)
        const updatedServiceVersion = await this._proposalRepo.updateServiceVersion(sourceId, Number(ServiceNumber), ServiceStatus.UPLOADED, versionResult.version)
        if (!updatedServiceVersion) {
            throw new AppError(PROPOSAL_MESSAGES.SERVICE.UPDATE_FAIL, RESPONSE_CODE.NOT_FOUND)
        }
        Logger.info(`updated the service ${JSON.stringify(updatedServiceVersion)}`)

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

        if (updatedVersion.status === VERSION_STATUS.APPROVED) {
            const updateCurrentServiceStatus = await this._proposalRepo.acceptOrRejectServiceResult(proposal.sourceId.toString(), service.order, ServiceStatus.COMPLETED)
            if (!updateCurrentServiceStatus) {
                throw new AppError(PROPOSAL_MESSAGES.SERVICE.CANNOT_COMPLETE, RESPONSE_CODE.NOT_FOUND)
            }
            const designerAmount = service.escrow?.designerPayout
            const platformFee = service.escrow?.platformCommission
            if (!designerAmount || !platformFee) {
                throw new AppError(PROPOSAL_MESSAGES.PAYMENT.PAYOUT_NOT_FOUND, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
            }
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