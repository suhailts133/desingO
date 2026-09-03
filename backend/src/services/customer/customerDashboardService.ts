import type { CustomerDashboardDTO } from "../../DTO/common/dashboard";
import { DashboardMapper } from "../../dtoMappers/common/dashboardMapper";
import type { IUserRepository } from "../../interfaces/auth/IUserRepository";
import type { IApiResponse } from "../../interfaces/base/IApiResponse";
import type { IActiveJobRepository, IJobRepository } from "../../interfaces/customer/ICustomerRepository";
import type { ICustomerDashboardService } from "../../interfaces/customer/ICustomerService";
import type { IDisputeRepository } from "../../interfaces/proposal/IDispute";
import type { IProposalRepository } from "../../interfaces/proposal/IProposalRepository";
import { USER_TYPE } from "../../shared/enums/proposalEnums";
import { RESPONSE_CODE } from "../../shared/enums/statusCode";
import { AppError } from "../../shared/errors/appError";
import { AUTH_MESSAGES } from "../../shared/messages/authMessages";
import { DASHBOARD_MESSAGES } from "../../shared/messages/dashobardMessages";

/**
 * This service manages designer dashboard
 */
export class CustomerDashboardService implements ICustomerDashboardService {
    constructor(private _jobRepo:IJobRepository, private _disputeRepo: IDisputeRepository, private _userRepo: IUserRepository, private _proposalRepo: IProposalRepository, private _activeJobRepo: IActiveJobRepository) { }

    /**
     Get designer dashboard data — wallet, active jobs, pending proposals, disputes, and design count.
     * 
     * @param customerId  string customerId
     * @returns aggregated dashboard data for the customer
     * @throws {AppError} 404 if customerId is not found
     */
    async getCustomerDashboard(customerId: string): Promise<IApiResponse<CustomerDashboardDTO>> {
        const designer = await this._userRepo.findUserById(customerId);
        if (!designer) {
            throw new AppError(AUTH_MESSAGES.USER.NOT_FOUND, RESPONSE_CODE.NOT_FOUND);
        }

        const [proposals, activeJobsCount, disputes, totalJobCount] = await Promise.all([
            this._proposalRepo.getProposalsByUserId(customerId, USER_TYPE.CUSTOMER),
            this._activeJobRepo.countCustomerActiveJobs(customerId),
            this._disputeRepo.getAllDisputePerUserId(customerId, USER_TYPE.CUSTOMER),
            this._jobRepo.countJobs(customerId)
        ]);

        const dashboardData = DashboardMapper.customerDashboardDTO(designer, proposals, disputes, activeJobsCount,totalJobCount);
        return { message: DASHBOARD_MESSAGES.DASHBOARD.SUCCESS, data: dashboardData };
    }
}