import type { EditJobRepoData, EditJobRequest, JobDetailResponseDTO, JobFilter, JobsCommonResponseDTO, JobsResponseDTO } from "../../DTO/user/jobsDTO";
import { RESPONSE_CODE } from "../../shared/enums/statusCode";
import type { IApiResponse, IApiResponseWithPagination } from "../../interfaces/base/IApiResponse";
import type { ICreateJobRequest } from "../../interfaces/customer/ICustomer";
import type {  IJobRepository } from "../../interfaces/customer/ICustomerRepository";
import type { IJobRequestService } from "../../interfaces/customer/ICustomerService";
import { AppError } from "../../shared/errors/appError";
import type { IImageUploaderService, ImageUploadResult } from "../../interfaces/base/IImageUpload";
import { CLOUDINARY_FOLDER_NAME } from "../../shared/enums/commonEnums";
import { JOB_MESSAGES } from "../../shared/messages/jobMessages";
import { JobRequestMapper } from "../../dtoMappers/user/jobRequestMapper";

export class JobRequestService implements IJobRequestService {
    constructor(private _jobRequestRepo: IJobRepository, private _imageUploder: IImageUploaderService ) { }

    async addJobRequest(userId: string, data: ICreateJobRequest, refrenceImages?: Express.Multer.File[]): Promise<IApiResponse> {

        const reference: ImageUploadResult[] = await this._imageUploder.uploadMany(refrenceImages ?? [], CLOUDINARY_FOLDER_NAME.GALLERY)

        const result = await this._jobRequestRepo.createJobRequest(userId, data, reference);
        if (!result) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.JOB_REQUEST_FAIL, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        return { message: JOB_MESSAGES.JOB_REQUEST.JOB_REQUEST_SUCCESS }

    }


    async editJobRequest(jobId: string, data: EditJobRequest, refrenceImages?: Express.Multer.File[]): Promise<IApiResponse> {
        const { oldReferences, ...rest } = data;

        const jobRepoData: EditJobRepoData = {
            ...rest,
        };
        const jobRequest = await this._jobRequestRepo.getJobRequest(jobId);
        if (!jobRequest) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.NOT_FOUND, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
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
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.UPDATION_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        return { message: JOB_MESSAGES.JOB_REQUEST.UPDATION_SUCCESS }

    }


    async getMyJobs(userId: string, page?: string): Promise<IApiResponseWithPagination<JobsResponseDTO[]>> {

        const result = await this._jobRequestRepo.getMyJobs(userId, page);
        const jobsData = JobRequestMapper.toMyJobRequestsDTOlist(result.data)
        return {
            total: result.pagination.total,
            totalPages: result.pagination.totalPages,
            data: jobsData,
            message: JOB_MESSAGES.JOB_REQUEST.MY_JOB_REQUEST
        }

    }


    async getJobRequestDetail(jobId: string): Promise<IApiResponse<JobDetailResponseDTO>> {
        const result = await this._jobRequestRepo.getJobRequest(jobId);
        if (!result) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.NOT_FOUND, RESPONSE_CODE.NO_CONTENT)
        }
        const jobData = JobRequestMapper.toJobRequestDTO(result)
        return { message: JOB_MESSAGES.JOB_REQUEST.JOB_REQUEST, data: jobData };

    }


    async getAllJobs(JobFilter?: JobFilter): Promise<IApiResponseWithPagination<JobsCommonResponseDTO[]>> {

        const result = await this._jobRequestRepo.getAllJobs(JobFilter)
        const jobsData = JobRequestMapper.toJobRequestsDTOlist(result.data)
        return {
            message: JOB_MESSAGES.JOB_REQUEST.ALL_JOB_REQUEST,
            data: jobsData,
            total: result.pagination.total,
            totalPages: result.pagination.totalPages

        }

    }


    async deleteAJob(id: string): Promise<IApiResponse> {
        const jobRequest = await this._jobRequestRepo.getJobRequest(id);
        if (!jobRequest) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.NOT_FOUND, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        if (jobRequest.referenceImages && jobRequest.referenceImages.length > 0) {
            await this._imageUploder.deleteMany(jobRequest.referenceImages.map(e => e.filename))
        }

        const result = await this._jobRequestRepo.deleteAJob(id);
        if (!result) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.DELETION_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        return { message: JOB_MESSAGES.JOB_REQUEST.DELETION_SUCCESS };

    }
}