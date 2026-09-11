import type { AdminDashboardDTO } from "../../DTO/admin/adminDashboard";
import { DashboardMapper } from "../../dtoMappers/common/dashboardMapper";
import type { IAdminDashboardService } from "../../interfaces/admin/IAdminService";
import type { IUserRepository } from "../../interfaces/auth/IUserRepository";
import type { IApiResponse } from "../../interfaces/base/IApiResponse";
import type { ITransactionRepository } from "../../interfaces/base/ITransaction";
import type { IActiveJobRepository } from "../../interfaces/customer/ICustomerRepository";
import type { IDesignerRepository } from "../../interfaces/designer/IDesignerRepository";
import type { IDisputeRepository } from "../../interfaces/proposal/IDispute";
import { DASHBOARD_MESSAGES } from "../../shared/messages/dashobardMessages";

export class AdminDashboardService implements IAdminDashboardService {
    constructor(private _disputeRepo: IDisputeRepository, private _userRepo: IUserRepository, private _designerRepo: IDesignerRepository, private _transactionRepo: ITransactionRepository, private _activeJobRepo: IActiveJobRepository) { }

    async getAdminDashBoard(): Promise<IApiResponse<AdminDashboardDTO>> {
        const [dispute, activeUserCount, pendingRequests, commision, activeJobCount] = await Promise.all([
            this._disputeRepo.getDisputesRequiringAdminAction(),
            this._userRepo.countActiveUsers(),
            this._designerRepo.getRequestRequiringAdminAction(),
            this._transactionRepo.getCommisionTransactions(),
            this._activeJobRepo.countAllActiveJob()
        ]);

        const data = DashboardMapper.adminDashboardDTO(dispute, activeUserCount, pendingRequests, commision, activeJobCount);
        return { message: DASHBOARD_MESSAGES.DASHBOARD.SUCCESS, data };
    }
}