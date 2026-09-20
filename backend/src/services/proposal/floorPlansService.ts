import type { AcceptOrRejectFloorPlanDTO, floorPlanRepoDTO } from "../../DTO/proposal/floorplans";
import type { IApiResponse } from "../../interfaces/base/IApiResponse";
import type { IImageUploaderService, ImageUploadResult } from "../../interfaces/base/IImageUpload";
import type { ITransactionManager } from "../../interfaces/base/ITransactionManager";
import type { IFloorPlanRepository, IFloorPlanService } from "../../interfaces/proposal/IFloorPlan";
import type { IProposalRepository } from "../../interfaces/proposal/IProposalRepository";
import { CLOUDINARY_FOLDER_NAME } from "../../shared/enums/commonEnums";
import { CONTRACT_STATUS, VERSION_STATUS } from "../../shared/enums/proposalEnums";
import { RESPONSE_CODE } from "../../shared/enums/statusCode";
import { AppError } from "../../shared/errors/appError";
import { PROPOSAL_MESSAGES } from "../../shared/messages/proposalMessages";

export class FloorPlansService implements IFloorPlanService {
  constructor(
    private _floorPlanRepo: IFloorPlanRepository,
    private _imageService: IImageUploaderService,
    private _proposalRepo: IProposalRepository,
    private _transactionManager: ITransactionManager,
  ) {}

  async acceptOrRejectFloorPlan(data: AcceptOrRejectFloorPlanDTO): Promise<IApiResponse> {
    const floorPlan = await this._floorPlanRepo.getFloorPlan(data.floorPlanId);
    if (!floorPlan) {
      throw new AppError(PROPOSAL_MESSAGES.FLOOR_PLANS.NOT_FOUND, RESPONSE_CODE.NOT_FOUND);
    }
    if (floorPlan.status !== VERSION_STATUS.PENDING) {
      throw new AppError(PROPOSAL_MESSAGES.FLOOR_PLANS.ALREDY_CHANGED(floorPlan.status), RESPONSE_CODE.BAD_REQUEST);
    }

    await this._transactionManager.runInTransaction(async (session) => {
      console.log(session.id, "accept or reject floorplan");
      const updatedFloorPlan = await this._floorPlanRepo.updateFloorPlan(
        floorPlan.id,
        {
          status: data.status,
          ...(data.rejectionReason && { rejectionReason: data.rejectionReason }),
        },
        session,
      );

      if (!updatedFloorPlan) {
        throw new AppError(PROPOSAL_MESSAGES.FLOOR_PLANS.UPDATE_FAIL, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
      }

      if (updatedFloorPlan.status === VERSION_STATUS.APPROVED) {
        const updatedProposal = await this._proposalRepo.updateProposal(floorPlan.proposalId.toString(), { isFloorPlanApproved: true }, session);
        if (!updatedProposal) {
          throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.UPDATE_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
        }

        const firstService = await this._proposalRepo.openFirstServiceAndMarkOngoing(updatedProposal.sourceId.toString(), session);
        if (!firstService) {
          throw new AppError(PROPOSAL_MESSAGES.SERVICE.CANNOT_OPEN_FIRST, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
        }
      }
    });

    return { message: PROPOSAL_MESSAGES.FLOOR_PLANS.UPDATE_SUCCESS };
  }

  async uploadFloorPlan(proposalId: string, floorPlans: Express.Multer.File): Promise<IApiResponse> {
    const proposal = await this._proposalRepo.getProposalbyId(proposalId);
    if (!proposal) {
      throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.NOT_FOUND, RESPONSE_CODE.NOT_FOUND);
    }
    if (!proposal.siteVisitingNeeded) {
      throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.SITE_VIST_NOT_NEEDED, RESPONSE_CODE.BAD_REQUEST);
    }
    if (proposal.contractStatus !== CONTRACT_STATUS.ACCEPTED) {
      throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.NOT_ONGOING, RESPONSE_CODE.BAD_REQUEST);
    }
    if (proposal.isFloorPlanApproved) {
      throw new AppError(PROPOSAL_MESSAGES.FLOOR_PLANS.CANT_UPLOAD, RESPONSE_CODE.BAD_REQUEST);
    }
    const floorPlanPdf: ImageUploadResult = await this._imageService.upload(floorPlans, CLOUDINARY_FOLDER_NAME.FLOOR_PLANS);
    const repoData: floorPlanRepoDTO = {
      plans: floorPlanPdf,
      version: proposal.floorPlanVersion + 1,
      proposalId,
    };
    await this._transactionManager.runInTransaction(async (session) => {
        console.log(session.id, "from create floorplan service")
      const floorPlan = await this._floorPlanRepo.createFloorPlan(repoData,session);
      if (!floorPlan) {
        throw new AppError(PROPOSAL_MESSAGES.FLOOR_PLANS.FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
      }
      const updateProposal = await this._proposalRepo.updateProposal(proposalId, { floorPlanVersion: floorPlan.version },session);
      if (!updateProposal) {
        throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.UPDATE_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
      }
    });

    return { message: PROPOSAL_MESSAGES.FLOOR_PLANS.SUCCESS, statuscode: RESPONSE_CODE.CREATED };
  }
}
