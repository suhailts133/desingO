import type { EditJobRepoData, EditJobRequest, JobDetailResponseDTO, JobFilter, JobsCommonResponseDTO, JobsResponseDTO } from "../../DTO/user/jobsDTO.js";
import { RESPONSE_CODE } from "../../shared/enums/statusCode.js";
import type { IApiResponse, IApiResponseWithPagination } from "../../interfaces/base/IApiResponse.js";
import type { ICreateJobRequest } from "../../interfaces/customer/ICustomer.js";
import type { IJobRepository } from "../../interfaces/customer/ICustomerRepository.js";
import type { IJobRequestService } from "../../interfaces/customer/ICustomerService.js";
import { AppError } from "../../shared/errors/appError.js";
import { MESSAGES } from "../../shared/messages/messages.js";
import type { IImageUploaderService, ImageUploadResult } from "../../interfaces/base/IImageUpload.js";
import { CLOUDINARY_FOLDER_NAME } from "../../shared/enums/commonEnums.js";

export class JobRequestService implements IJobRequestService {
    constructor(private _jobRequestRepo: IJobRepository, private _imageUploder: IImageUploaderService) { }

    async addJobRequest(userId: string, data: ICreateJobRequest, refrenceImages?: Express.Multer.File[]): Promise<IApiResponse> {

        const reference: ImageUploadResult[] = await this._imageUploder.uploadMany(refrenceImages ?? [], CLOUDINARY_FOLDER_NAME.GALLERY)

        const result = await this._jobRequestRepo.createJobRequest(userId, data, reference);
        if (!result) {
            throw new AppError(MESSAGES.JOB_REQUEST.JOB_REQUEST_FAIL, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        return { message: "Job request posted successfully." }

    }


    async editJobRequest(jobId: string, data: EditJobRequest, refrenceImages?: Express.Multer.File[]): Promise<IApiResponse> {
        const { oldReferences, ...rest } = data;

        const jobRepoData: EditJobRepoData = {
            ...rest,
        };
        const jobRequest = await this._jobRequestRepo.getJobRequest(jobId);
        if (!jobRequest) {
            throw new AppError(MESSAGES.JOB_REQUEST.NOT_FOUND, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        if (!oldReferences && jobRequest.referenceImages) {
            await this._imageUploder.deleteMany(jobRequest.referenceImages.map(e => e.filename));
        }

        const oldFilenames = new Set((oldReferences ?? []).map(img => img.filename));

        const imagesToDelete = jobRequest.referenceImages
            .filter(img => !oldFilenames.has(img.filename))
            .map(img => img.filename);

        if (imagesToDelete.length > 0) {
            await this._imageUploder.deleteMany(imagesToDelete);
        }
        let newRefrenceImages: ImageUploadResult[] | undefined = undefined;

        if (refrenceImages && refrenceImages.length > 0) {
            newRefrenceImages = await this._imageUploder.uploadMany(refrenceImages, CLOUDINARY_FOLDER_NAME.REFERENCE_IMAGES);
        }

        const finalRefrenceImages: ImageUploadResult[] = [
            ...(oldReferences ?? []),
            ...(newRefrenceImages ?? []),
        ];
        const result = await this._jobRequestRepo.editJobRequest(jobId, jobRepoData, finalRefrenceImages)
        if (!result) {
            throw new AppError(MESSAGES.JOB_REQUEST.UPDATION_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        return { message: MESSAGES.JOB_REQUEST.UPDATION_SUCCESS }

    }


    async getAllJobs(userId: string, page?: string): Promise<IApiResponseWithPagination<JobsResponseDTO[]>> {

        const result = await this._jobRequestRepo.getAllJobs(userId, page);
        return {
            total: result.pagination.total,
            totalPages: result.pagination.totalPages,
            data: result.data,
            message: MESSAGES.JOB_REQUEST.MY_JOB_REQUEST
        }

    }


    async getAJobRequest(jobId: string): Promise<IApiResponse<JobDetailResponseDTO>> {
        const result = await this._jobRequestRepo.getAJobRequest(jobId);
        if (!result) {
            throw new AppError(MESSAGES.JOB_REQUEST.NOT_FOUND, RESPONSE_CODE.NO_CONTENT)
        }
        return { message: MESSAGES.JOB_REQUEST.JOB_REQUEST, data: result };

    }


    async getJobRequestcommon(JobFilter?: JobFilter): Promise<IApiResponseWithPagination<JobsCommonResponseDTO[]>> {

        const result = await this._jobRequestRepo.getAllJobsCommon(JobFilter)
        return {
            message: MESSAGES.JOB_REQUEST.ALL_JOB_REQUEST,
            data: result.data,
            total: result.pagination.total,
            totalPages: result.pagination.totalPages

        }

    }


    async deleteAJob(id: string): Promise<IApiResponse> {
        const jobRequest = await this._jobRequestRepo.getJobRequest(id);
        if (!jobRequest) {
            throw new AppError(MESSAGES.JOB_REQUEST.NOT_FOUND, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        if (jobRequest.referenceImages && jobRequest.referenceImages.length > 0) {
            await this._imageUploder.deleteMany(jobRequest.referenceImages.map(e => e.filename))
        }

        const result = await this._jobRequestRepo.deleteAJob(id);
        if (!result) {
            throw new AppError(MESSAGES.JOB_REQUEST.DELETION_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        return { message: MESSAGES.JOB_REQUEST.DELETION_SUCCESS };

    }
}