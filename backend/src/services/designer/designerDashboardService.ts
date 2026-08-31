import type { DesignerDashboardDTO } from "../../DTO/common/dashboard";
import { DashboardMapper } from "../../dtoMappers/common/dashboardMapper";
import type { IUserRepository } from "../../interfaces/auth/IUserRepository";
import type { IApiResponse } from "../../interfaces/base/IApiResponse";
import type { IActiveJobRepository } from "../../interfaces/customer/ICustomerRepository";
import type { IDesignRepository } from "../../interfaces/designer/IDesignerRepository";
import type { IDesignerDashboardService } from "../../interfaces/designer/IDesignerService";
import type { IDisputeRepository } from "../../interfaces/proposal/IDispute";
import type { IProposalRepository, IReviewRepository } from "../../interfaces/proposal/IProposalRepository";
import { USER_TYPE } from "../../shared/enums/proposalEnums";
import { RESPONSE_CODE } from "../../shared/enums/statusCode";
import { AppError } from "../../shared/errors/appError";
import { AUTH_MESSAGES } from "../../shared/messages/authMessages";
import { DASHBOARD_MESSAGES } from "../../shared/messages/dashobardMessages";

export class DesignerDashboardService implements IDesignerDashboardService {
    constructor(private _designRepo: IDesignRepository, private _disputeRepo: IDisputeRepository, private _userRepo: IUserRepository, private _proposalRepo: IProposalRepository, private _reviewRepo: IReviewRepository, private _activeJobRepo: IActiveJobRepository) { }

    async getDesignerDashboard(designerId: string): Promise<IApiResponse<DesignerDashboardDTO>> {
        const designer = await this._userRepo.findUserById(designerId)
        if (!designer) {
            throw new AppError(AUTH_MESSAGES.USER.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }

        const proposals = await this._proposalRepo.getProposalsByUserId(designerId, USER_TYPE.DESIGNER)
        const reviews = await this._reviewRepo.getAllReviews(designerId)
        const activeJobs = await this._activeJobRepo.getAllActiveJobPerDesigner(designerId)
        const disputes = await this._disputeRepo.getAllDisputePerUserId(designerId, USER_TYPE.DESIGNER)
        const totalDesigns = await this._designRepo.countMyDesigns(designerId)
        const dashboardData = DashboardMapper.designerDashboardDTO(totalDesigns, designer, proposals, reviews, disputes, activeJobs)
        return { message: DASHBOARD_MESSAGES.DASHBOARD.SUCCESS, data: dashboardData }
    }
}