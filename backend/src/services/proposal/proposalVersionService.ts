import type { VersionAcceptOrRejectDTO } from "../../DTO/proposal/version";
import type { IUserRepository } from "../../interfaces/auth/IUserRepository";
import type { IApiResponse } from "../../interfaces/base/IApiResponse";
import type { IImageUploaderService, ImageUploadResult } from "../../interfaces/base/IImageUpload";
import type { ITransactionRepository } from "../../interfaces/base/ITransaction";
import type { ITransactionManager } from "../../interfaces/base/ITransactionManager";
import type { IActiveJobRepository, IJobRepository } from "../../interfaces/customer/ICustomerRepository";
import type { IDesignRepository } from "../../interfaces/designer/IDesignerRepository";
import type { IProposalRepository, IServiceVersionRepository } from "../../interfaces/proposal/IProposalRepository";
import type { IProposalVersionService } from "../../interfaces/proposal/IProposalService";
import { ACTIVE_JOB_STATUS, CLOUDINARY_FOLDER_NAME, DESIGN_JOB_COUNT, SOURCE_TYPE, TRANSACTION_TYPE, TRANSACTION_UNIQUE_ID, USER_ROLES } from "../../shared/enums/commonEnums";
import { CONTRACT_STATUS, EscrowStatus, ServicePaymentStatus, ServiceStatus, VERSION_STATUS } from "../../shared/enums/proposalEnums";
import { RESPONSE_CODE } from "../../shared/enums/statusCode";
import { AppError } from "../../shared/errors/appError";
import { generateUniqueId } from "../../shared/helpers/extraFunctions";
import { ADMIN_MESSAGES } from "../../shared/messages/adminMessages";
import { DESIGNER_MESSAGES } from "../../shared/messages/designerMessages";
import { JOB_MESSAGES } from "../../shared/messages/jobMessages";
import { PROPOSAL_MESSAGES } from "../../shared/messages/proposalMessages";

export class ProposalVersionService implements IProposalVersionService {
  constructor(
    private _jobRepo: IJobRepository,
    private _designRepo: IDesignRepository,
    private _activeJobRepo: IActiveJobRepository,
    private _transactionRepo: ITransactionRepository,
    private _proposalRepo: IProposalRepository,
    private _serviceVersionRepo: IServiceVersionRepository,
    private _imageUploder: IImageUploaderService,
    private _userRepo: IUserRepository,
    private _transactionManager: ITransactionManager,
  ) {}

  async uploadProposalImage(sourceId: string, ServiceNumber: number, serviceImages: Express.Multer.File[]): Promise<IApiResponse> {
    const proposal = await this._proposalRepo.getProposal(sourceId);
    if (!proposal) {
      throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.NOT_FOUND, RESPONSE_CODE.NOT_FOUND);
    }

    const service = proposal.services.find((s) => s.order === Number(ServiceNumber) && (s.status === ServiceStatus.IN_PROGRESS || s.status === ServiceStatus.REDO));
    if (!service) {
      throw new AppError(PROPOSAL_MESSAGES.SERVICE.NOT_FOUND, RESPONSE_CODE.NOT_FOUND);
    }
    if (service.paymentStatus === ServicePaymentStatus.PENDING) {
      throw new AppError(PROPOSAL_MESSAGES.SERVICE.NOT_PAID, RESPONSE_CODE.CONFILT);
    }
    const currntVersion = service.currentVersion;
    const images: ImageUploadResult[] = await this._imageUploder.uploadMany(serviceImages ?? [], CLOUDINARY_FOLDER_NAME.SERVICE_RESULT);
    const versionResult = await this._serviceVersionRepo.createVersion({
      proposalId: proposal.id,
      sourceId: proposal.sourceId.toString(),
      version: currntVersion + 1,
      images,
      serviceOrder: service.order,
    });
    if (!versionResult) {
      throw new AppError("version createion failed", RESPONSE_CODE.INTERNAL_SERVER_ERROR);
    }

    const updatedServiceVersion = await this._proposalRepo.updateServiceVersion(sourceId, Number(ServiceNumber), ServiceStatus.UPLOADED, versionResult.version);
    if (!updatedServiceVersion) {
      throw new AppError(PROPOSAL_MESSAGES.SERVICE.UPDATE_FAIL, RESPONSE_CODE.NOT_FOUND);
    }

    return { message: PROPOSAL_MESSAGES.SERVICE.SUCCESS };
  }

  async acceptOrRejectVersion(data: VersionAcceptOrRejectDTO): Promise<IApiResponse> {
    const version = await this._serviceVersionRepo.findVersion(data.versionId);
    if (!version) {
      throw new AppError(PROPOSAL_MESSAGES.VERSION.NOT_FOUND, RESPONSE_CODE.BAD_REQUEST);
    }
    const proposal = await this._proposalRepo.getProposal(version.sourceId.toString());
    if (!proposal) {
      throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.NOT_FOUND, RESPONSE_CODE.NOT_FOUND);
    }
    const service = proposal.services.find((e) => e.order === version.serviceOrder);
    if (!service) {
      throw new AppError(PROPOSAL_MESSAGES.SERVICE.NOT_FOUND, RESPONSE_CODE.BAD_REQUEST);
    }
    const paymentDetails = service.escrow;
    if (!paymentDetails) {
      throw new AppError(PROPOSAL_MESSAGES.ESCROW.NOT_FOUND, RESPONSE_CODE.NOT_FOUND);
    }

    return await this._transactionManager.runInTransaction(async (session) => {
      console.log(session.id, "accept or reject version");
      const updatedVersion = await this._serviceVersionRepo.acceptOrRejectVersion(data, session);
      if (!updatedVersion) {
        throw new AppError(PROPOSAL_MESSAGES.VERSION.UPDATE_FAIL, RESPONSE_CODE.NOT_FOUND);
      }

      if (updatedVersion.status === VERSION_STATUS.APPROVED) {
        const updateCurrentServiceStatus = await this._proposalRepo.acceptOrRejectServiceResult(proposal.sourceId.toString(), service.order, ServiceStatus.COMPLETED, session);
        if (!updateCurrentServiceStatus) {
          throw new AppError(PROPOSAL_MESSAGES.SERVICE.CANNOT_COMPLETE, RESPONSE_CODE.NOT_FOUND);
        }

        const admin = await this._userRepo.findByRole(USER_ROLES.ADMIN);
        if (!admin) {
          throw new AppError(ADMIN_MESSAGES.ADMIN.NOT_FOUND, RESPONSE_CODE.NOT_FOUND);
        }

        const designerAmount = paymentDetails.designerPayout;
        const platformFee = paymentDetails.platformCommission;

        const designerNewWalletAmount = proposal.designerId.wallet + designerAmount;
        const updatedWalletDesigner = await this._userRepo.updateUser(proposal.designerId.id, { wallet: designerNewWalletAmount }, session);
        if (!updatedWalletDesigner) {
          throw new AppError(PROPOSAL_MESSAGES.PAYMENT.PAYOUT_DESIGNER_FAILED, RESPONSE_CODE.NOT_FOUND);
        }

        await this._transactionRepo.createTransaction(
          {
            sourceUserId: admin.id,
            destinationUserId: updatedWalletDesigner.id,
            amount: designerAmount,
            type: TRANSACTION_TYPE.PAYOUT,
            TransactionId: generateUniqueId(TRANSACTION_UNIQUE_ID.PAYOUT),
            proposalId: proposal.id,
          },
          session,
        );

        const escrowChanged = await this._proposalRepo.changeEscrowStatus(version.sourceId.toString(), service.order, EscrowStatus.RELEASED, session);
        if (!escrowChanged) {
          throw new AppError(PROPOSAL_MESSAGES.ESCROW.ESCROW_STATUS_CHANGED, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
        }

        const amountHeldCleared = await this._proposalRepo.updateProposal(proposal.id, { currentAmountHeld: 0 }, session);
        if (!amountHeldCleared) {
          throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.UPDATE_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
        }

        const adminNewWalletAmount = admin.wallet + platformFee;
        const updatedAdminWallet = await this._userRepo.updateUser(admin.id, { wallet: adminNewWalletAmount }, session);
        if (!updatedAdminWallet) {
          throw new AppError(PROPOSAL_MESSAGES.PAYMENT.PAYOUT_ADMIN_FAILED, RESPONSE_CODE.NOT_FOUND);
        }

        await this._transactionRepo.createTransaction(
          {
            sourceUserId: admin.id,
            destinationUserId: admin.id,
            amount: platformFee,
            type: TRANSACTION_TYPE.COMMISSION,
            TransactionId: generateUniqueId(TRANSACTION_UNIQUE_ID.COMMISSION),
            proposalId: proposal.id,
          },
          session,
        );

        const newService = proposal.services.find((e) => e.order === updatedVersion.serviceOrder + 1);
        if (newService) {
          const updatedProposal = await this._proposalRepo.acceptOrRejectServiceResult(proposal.sourceId.toString(), newService.order, ServiceStatus.OPEN, session);
          if (!updatedProposal) {
            throw new AppError(PROPOSAL_MESSAGES.SERVICE.CANNOT_OPEN, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
          }
          return { message: PROPOSAL_MESSAGES.VERSION.UPDATE_SUCCESS };
        }

        const completedCount = proposal.services.filter((e) => e.order !== service.order && e.status === ServiceStatus.COMPLETED).length;
        const allCompleted = completedCount === proposal.services.length - 1;

        if (allCompleted) {
          const updateContractStatus = await this._proposalRepo.updateProposal(proposal.id, { contractStatus: CONTRACT_STATUS.COMPLETED }, session);
          if (!updateContractStatus) {
            throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.CONTRACT_STATUS_FAIL, RESPONSE_CODE.BAD_REQUEST);
          }

          const updateActiveJobStatus = await this._activeJobRepo.updateActiveJob(proposal.sourceId.toString(), { status: ACTIVE_JOB_STATUS.COMPLETED }, session);
          if (!updateActiveJobStatus) {
            throw new AppError(JOB_MESSAGES.ACTIVE_JOB.UPDATION_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
          }

          if (updateContractStatus.sourceType === SOURCE_TYPE.DIRECT_HIRE) {
            const job = await this._jobRepo.getJobRequest(proposal.sourceId.toString());
            if (!job) {
              throw new AppError(JOB_MESSAGES.JOB_REQUEST.NOT_FOUND, RESPONSE_CODE.NOT_FOUND);
            }
            if (job.designId) {
              const designCountDec = await this._designRepo.adjustActiveJobCount(job.designId.toString(), DESIGN_JOB_COUNT.DEC, session);
              if (!designCountDec) {
                throw new AppError(DESIGNER_MESSAGES.DESIGNS.UPDATION_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
              }
            }
          }
        }
        return { message: PROPOSAL_MESSAGES.VERSION.UPDATE_SUCCESS };
      }

      const rejectService = await this._proposalRepo.acceptOrRejectServiceResult(proposal.sourceId.toString(), service.order, ServiceStatus.REDO, session);
      if (!rejectService) {
        throw new AppError(PROPOSAL_MESSAGES.SERVICE.UPDATE_FAIL, RESPONSE_CODE.BAD_REQUEST);
      }

      return { message: PROPOSAL_MESSAGES.VERSION.UPDATE_SUCCESS };
    });
  }
}
