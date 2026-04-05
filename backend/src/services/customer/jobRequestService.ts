import type { JobDetailResponseDTO, JobFilter, JobsCommonResponseDTO, JobsResponseDTO } from "../../DTO/user/jobsDTO.js";
import { ensureError } from "../../helpers/errors/ensureError.js";
import { RESPONSE_CODE } from "../../helpers/enums/statusCode.js";
import type { IApiResponse, IApiResponseWithPagination } from "../../interfaces/base/IApiResponse.js";
import type { ICreateJobRequest } from "../../interfaces/customer/ICustomer.js";
import type { IJobRepository } from "../../interfaces/customer/ICustomerRepository.js";
import type { IJobRequestService } from "../../interfaces/customer/ICustomerService.js";

export class JobRequestService implements IJobRequestService {
    constructor(private _jobRequestRepo: IJobRepository) { }

    async addJobRequest(userId: string, data: ICreateJobRequest): Promise<IApiResponse> {
        try {
            const result = await this._jobRequestRepo.createJobRequest(userId, data);
            if (!result) {
                return { statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR, success: false, message: "Failed to post job request, please try again" }
            }
            return { statuscode: RESPONSE_CODE.OK, success: true, message: "Job request posted successfully" }
        } catch (error) {
            const err = ensureError(error).message;
            console.log(err);
            return { statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR, success: false, message: "Server Error while adding job request" }
        }
    }

    async getAllJobs(userId: string, page?: string): Promise<IApiResponseWithPagination<JobsResponseDTO[]>> {
        try {
            const result = await this._jobRequestRepo.getAllJobs(userId, page);
            return {
                success: true,
                statuscode: RESPONSE_CODE.OK,
                total: result.pagination.total,
                totalPages: result.pagination.totalPages,
                data: result.data,
                message: "Job requests Fetched Successfully."
            }
        } catch (error) {
            const err = ensureError(error)
            console.log(err)
            return { statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR, message: "Something went wrong while fetching job requests. Please try again or contact support", success: false, total: 0, totalPages: 0 }
        }
    }


    async getAJobRequest(jobId: string): Promise<IApiResponse<JobDetailResponseDTO>> {
        try {
            const result = await this._jobRequestRepo.getAJobRequest(jobId);
            if (!result) {
                return { success: false, statuscode: RESPONSE_CODE.NO_CONTENT, message: "Job Request Not found." };
            }
            return { success: true, statuscode: RESPONSE_CODE.OK, message: "Job Request fetched successfully.", data: result };
        } catch (error) {
            const err = ensureError(error)
            console.log(err)
            return { statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR, message: "Something went wrong while fetching job requests. Please try again or contact support", success: false, }
        }
    }


    async getJobRequestcommon(JobFilter?: JobFilter): Promise<IApiResponseWithPagination<JobsCommonResponseDTO[]>> {
        try {
            const result = await this._jobRequestRepo.getAllJobsCommon(JobFilter)
            return {
                success: true,
                message: "Job Requests fetching sucessfull",
                statuscode: RESPONSE_CODE.OK,
                data: result.data,
                total: result.pagination.total,
                totalPages: result.pagination.totalPages

            }
        } catch (error) {
            const err = ensureError(error)
            console.log(err)
            return { statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR, message: "Something went wrong while fetching Job Requests. Please try again or contact support", success: false, total: 0, totalPages: 0 }
        }
    }


    async deleteAJob(id: string): Promise<IApiResponse> {
        try {
            const result = await this._jobRequestRepo.deleteAJob(id);
            if (!result) {
                return { success: false, statuscode: RESPONSE_CODE.NO_CONTENT, message: "Job Request Not found." };
            }
            return { success: true, statuscode: RESPONSE_CODE.OK, message: "Job Request deletion successfully.", };
        } catch (error) {
            const err = ensureError(error)
            console.log(err)
            return { statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR, message: "Something went wrong while deleting Job Request. Please try again or contact support", success: false }
        }
    }
}