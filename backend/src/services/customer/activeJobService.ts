
import type { ActiveJobFilter, ActiveJobResponseDTO } from "../../DTO/user/activeJobDTO.js";
import { ActiveJobMapper } from "../../dtoMappers/common/activeJobMapper.js";
import type { IApiResponseWithPagination } from "../../interfaces/base/IApiResponse.js";
import type { MessageRole } from "../../interfaces/chat/IChat.js";
import type { IActiveJobRepository } from "../../interfaces/customer/ICustomerRepository.js";
import type { IActiveJobService } from "../../interfaces/customer/ICustomerService.js";
import { ACTIVE_JOB_STATUS, USER_ROLES } from "../../shared/enums/commonEnums.js";
import { RESPONSE_CODE } from "../../shared/enums/statusCode.js";
import { AppError } from "../../shared/errors/appError.js";
import { CHAT_MESSAGES } from "../../shared/messages/chatMessage.js";
import { JOB_MESSAGES } from "../../shared/messages/jobMessages.js";

export class ActiveJobService implements IActiveJobService {
    constructor(private _activeJobRepo: IActiveJobRepository) { }

    async getCustomerActiveJobs(id: string, filter?: ActiveJobFilter): Promise<IApiResponseWithPagination<ActiveJobResponseDTO[]>> {
        const { data, pagination } = await this._activeJobRepo.getCustomerActiveJobs(id, filter)
        const activeJobData = ActiveJobMapper.toCustomerActiveJobDTOlist(data, USER_ROLES.CUSTOMER);
        return { message: JOB_MESSAGES.ACTIVE_JOB.FETCH_ALL, data: activeJobData, total: pagination.total, totalPages: pagination.totalPages }

    }
    async validateJobForChat(activeJobId: string, userId: string): Promise<MessageRole> {

        const job = await this._activeJobRepo.getActiveJob(activeJobId);

        if (!job) {
            throw new AppError(JOB_MESSAGES.ACTIVE_JOB.NOT_FOUND, RESPONSE_CODE.NOT_FOUND);
        }


        if (job.status !== ACTIVE_JOB_STATUS.ACTIVE) {
            throw new AppError(CHAT_MESSAGES.CHAT.CANNOT_CHAT, RESPONSE_CODE.BAD_REQUEST);
        }

        if (job.userId.toString() === userId) return USER_ROLES.CUSTOMER;
        if (job.designerId.toString() === userId) return USER_ROLES.DESIGNER;

        throw new AppError(CHAT_MESSAGES.CHAT.NOT_PARTICIPANT, RESPONSE_CODE.FORBIDDEN);
    }


    async getDesignerActiveJobs(id: string, filter?: ActiveJobFilter): Promise<IApiResponseWithPagination<ActiveJobResponseDTO[]>> {

        const { data, pagination } = await this._activeJobRepo.getDesignerActiveJobs(id, filter)
        const activeJobData = ActiveJobMapper.toCustomerActiveJobDTOlist(data, USER_ROLES.DESIGNER);
        return { message: JOB_MESSAGES.ACTIVE_JOB.FETCH_ALL, data: activeJobData, total: pagination.total, totalPages: pagination.totalPages }

    }
}