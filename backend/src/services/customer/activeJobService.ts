import type { ActiveJobFilter, ActiveJobResponseDTO } from "../../DTO/user/activeJobDTO.js";
import { ActiveJobMapper } from "../../dtoMappers/common/activeJobMapper.js";
import type { IApiResponseWithPagination } from "../../interfaces/base/IApiResponse.js";
import type { IActiveJobRepository } from "../../interfaces/customer/ICustomerRepository.js";
import type { IActiveJobService } from "../../interfaces/customer/ICustomerService.js";
import { JOB_MESSAGES } from "../../shared/messages/jobMessages.js";

export class ActiveJobService implements IActiveJobService {
    constructor(private _activeJobRepo: IActiveJobRepository) { }

    async getCustomerActiveJobs(id: string, filter?: ActiveJobFilter): Promise<IApiResponseWithPagination<ActiveJobResponseDTO[]>> {
        const { data, pagination } = await this._activeJobRepo.getCustomerActiveJobs(id, filter)
        const activeJobData = ActiveJobMapper.toCustomerActiveJobDTOlist(data);
        return { message: JOB_MESSAGES.ACTIVE_JOB.FETCH_ALL, data: activeJobData, total: pagination.total, totalPages: pagination.totalPages }

    }


    async getDesignerActiveJobs(id: string, filter?: ActiveJobFilter): Promise<IApiResponseWithPagination<ActiveJobResponseDTO[]>> {
        const { data, pagination } = await this._activeJobRepo.getDesignerActiveJobs(id, filter)
        const activeJobData = ActiveJobMapper.toCustomerActiveJobDTOlist(data);
        return { message: JOB_MESSAGES.ACTIVE_JOB.FETCH_ALL, data: activeJobData, total: pagination.total, totalPages: pagination.totalPages }

    }
}