import type { EditJobRepoData, EditJobRequest, HireDesignerDTO, JobDetailResponseDTO, JobFilter, JobsCommonResponseDTO, JobsResponseDTO } from "../../DTO/user/jobsDTO";
import { RESPONSE_CODE } from "../../shared/enums/statusCode";
import type { IApiResponse, IApiResponseWithPagination } from "../../interfaces/base/IApiResponse";
import type { ICreateJobRequest, Source_type } from "../../interfaces/customer/ICustomer";
import type { IActiveJobRepository, IJobRepository } from "../../interfaces/customer/ICustomerRepository";
import type { IJobRequestService } from "../../interfaces/customer/ICustomerService";
import { AppError } from "../../shared/errors/appError";
import type { IImageUploaderService, ImageUploadResult } from "../../interfaces/base/IImageUpload";
import { CLOUDINARY_FOLDER_NAME, JOB_REQUEST_STATUS, SOURCE_TYPE } from "../../shared/enums/commonEnums";
import { JOB_MESSAGES } from "../../shared/messages/jobMessages";
import { JobRequestMapper } from "../../dtoMappers/user/jobRequestMapper";
import type { AcceptOrRejectHireDesignerDTO, HireDesignerFilter } from "../../DTO/user/hireDesignerDTO";

export class JobRequestService implements IJobRequestService {
    constructor(private _jobRequestRepo: IJobRepository, private _imageUploder: IImageUploaderService, private _activeJobRepo: IActiveJobRepository) { }



    async acceptOrRejectHireRequest(id: string, data: AcceptOrRejectHireDesignerDTO): Promise<IApiResponse> {
        const jobRequest = await this._jobRequestRepo.getJobRequest(id)
        if (!jobRequest) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }

        if (jobRequest.status !== JOB_REQUEST_STATUS.PENDING) {
            throw new AppError(JOB_MESSAGES.HIRE_DESIGNER.ALREADY_STATUS_CHANGED, RESPONSE_CODE.BAD_REQUEST)
        }

        const updatedHireRequst = await this._jobRequestRepo.updateHireRequest(id, data);
        if (!updatedHireRequst || !updatedHireRequst.designerId) {
            throw new AppError(JOB_MESSAGES.HIRE_DESIGNER.UPDATE_FAIL, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        const isActive = await this._activeJobRepo.createActiveJOb({
            userId: updatedHireRequst.userId.toString(),
            designerId: updatedHireRequst.designerId.toString(),
            sourceId: updatedHireRequst.id,
            sourceType: SOURCE_TYPE.DIRECT_HIRE,
            sourceName: updatedHireRequst.projectTitle
        })
        if (!isActive) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.UPDATION_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR)

        }
        return { message: JOB_MESSAGES.HIRE_DESIGNER.UPDATE_SUCCESS }
    }


    async addJobRequest(userId: string, data: ICreateJobRequest, refrenceImages?: Express.Multer.File[], floorPlanImages?: Express.Multer.File[]): Promise<IApiResponse> {

        const reference: ImageUploadResult[] = await this._imageUploder.uploadMany(refrenceImages ?? [], CLOUDINARY_FOLDER_NAME.GALLERY)
        const floorplans: ImageUploadResult[] = await this._imageUploder.uploadMany(floorPlanImages ?? [], CLOUDINARY_FOLDER_NAME.FLOOR_PLANS)
        console.log(data.designId , "Designid")
        console.log(data.designerId , "Designerid")
        const result = await this._jobRequestRepo.createJobRequest(userId, data, reference, floorplans);
        if (!result) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.JOB_REQUEST_FAIL, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        return { message: JOB_MESSAGES.JOB_REQUEST.JOB_REQUEST_SUCCESS }

    }
    async getjobRequestPerDesign(designId: string, filters?: HireDesignerFilter): Promise<IApiResponseWithPagination<HireDesignerDTO[]>> {
        const { data, pagination } = await this._jobRequestRepo.getjobRequestPerDesign(designId, filters);
        const hireDesignerData = JobRequestMapper.toHireRequestDTOList(data)
        return { message: JOB_MESSAGES.HIRE_DESIGNER.MY_REQUEST, data: hireDesignerData, total: pagination.total, totalPages: pagination.totalPages }
    }



    async editJobRequest(jobId: string, data: EditJobRequest, refrenceImages?: Express.Multer.File[], floorPlanImages?: Express.Multer.File[]): Promise<IApiResponse> {
        const { oldReferences, oldFloorPlans, ...rest } = data;

        const jobRepoData: EditJobRepoData = {
            ...rest,
        };
        const jobRequest = await this._jobRequestRepo.getJobRequest(jobId);
        if (!jobRequest) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.NOT_FOUND, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        if (jobRequest.status === JOB_REQUEST_STATUS.ACCEPTED) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.ACCEPTED_CANT_UPDATE, RESPONSE_CODE.BAD_REQUEST)
        }
        if (!oldReferences && jobRequest.referenceImages) {
            await this._imageUploder.deleteMany(jobRequest.referenceImages.map(e => e.filename));
        }
        if (!oldFloorPlans && jobRequest.floorPlans) {
            await this._imageUploder.deleteMany(jobRequest.floorPlans.map(e => e.filename));
        }

        const oldReferencesFiles = new Set((oldReferences ?? []).map(img => img.filename));
        const oldfloorPlanFiles = new Set((oldFloorPlans ?? []).map(img => img.filename));

        const imagesToDeleteReference = jobRequest.referenceImages
            .filter(img => !oldReferencesFiles.has(img.filename))
            .map(img => img.filename);

        const imagesToDeleteFloorPlans = jobRequest.floorPlans
            .filter(img => !oldfloorPlanFiles.has(img.filename))
            .map(img => img.filename);

        if (imagesToDeleteFloorPlans.length > 0) {
            await this._imageUploder.deleteMany(imagesToDeleteFloorPlans);
        }

        if (imagesToDeleteReference.length > 0) {
            await this._imageUploder.deleteMany(imagesToDeleteReference);
        }

        let newRefrenceImages: ImageUploadResult[] | undefined = undefined;
        let newFloorPlans: ImageUploadResult[] | undefined = undefined;

        if (refrenceImages && refrenceImages.length > 0) {
            newRefrenceImages = await this._imageUploder.uploadMany(refrenceImages, CLOUDINARY_FOLDER_NAME.REFERENCE_IMAGES);
        }
        if (floorPlanImages && floorPlanImages.length > 0) {
            newFloorPlans = await this._imageUploder.uploadMany(floorPlanImages, CLOUDINARY_FOLDER_NAME.REFERENCE_IMAGES);
        }

        const finalRefrenceImages: ImageUploadResult[] = [
            ...(oldReferences ?? []),
            ...(newRefrenceImages ?? []),
        ];
        const finalFloorPlans: ImageUploadResult[] = [
            ...(oldFloorPlans ?? []),
            ...(newFloorPlans ?? []),
        ];
        const result = await this._jobRequestRepo.editJobRequest(jobId, jobRepoData, finalRefrenceImages, finalFloorPlans)
        if (!result) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.UPDATION_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        return { message: JOB_MESSAGES.JOB_REQUEST.UPDATION_SUCCESS }

    }


    async getMyJobs(userId: string, sourceType: Source_type, page?: string): Promise<IApiResponseWithPagination<JobsResponseDTO[]>> {

        const result = await this._jobRequestRepo.getMyJobs(userId, sourceType, page);
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