
import type { AcceptOrRejectHireDesignerDTO, CreateHireDesignerDTO, getHireDesignerPerDesignResponseDTO, getMyHireDesignerRequestResponseDTO, HireDesignerFilter } from "../../DTO/user/hireDesignerDTO";
import { HireDesignerMapper } from "../../dtoMappers/user/hireDesignerMapper";
import type { IApiResponse, IApiResponseWithPagination } from "../../interfaces/base/IApiResponse";
import type { WarningDTO } from "../../interfaces/benchmark/IBenchMark";
import type { HireDesignerPayload } from "../../interfaces/customer/ICustomer";
import type { IActiveJobRepository, IHireDesignerRepository } from "../../interfaces/customer/ICustomerRepository";
import type { IHireDesignerService } from "../../interfaces/customer/ICustomerService";
import type { IDesignRepository } from "../../interfaces/designer/IDesignerRepository";
import { HIRE_DESIGNER_STATUS, SOURCE_TYPE } from "../../shared/enums/commonEnums";
import { RESPONSE_CODE } from "../../shared/enums/statusCode";
import { AppError } from "../../shared/errors/appError";
import { toSqFt } from "../../shared/helpers/extraFunctions";
import { DESIGNER_MESSAGES } from "../../shared/messages/designerMessages";
import { JOB_MESSAGES } from "../../shared/messages/jobMessages";

export class HireDesignerService implements IHireDesignerService {
    constructor(private _hireDesignerRepo: IHireDesignerRepository, private _designRepo: IDesignRepository, private _activeJobRepo: IActiveJobRepository) { }


    async acceptOrRejectHireRequest(id: string, data: AcceptOrRejectHireDesignerDTO): Promise<IApiResponse> {
        const hireRequest = await this._hireDesignerRepo.getHireDesignerById(id)
        if (!hireRequest) {
            throw new AppError(JOB_MESSAGES.HIRE_DESIGNER.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }

        if (hireRequest.status !== HIRE_DESIGNER_STATUS.PENDING) {
            throw new AppError(JOB_MESSAGES.HIRE_DESIGNER.ALREADY_STATUS_CHANGED, RESPONSE_CODE.BAD_REQUEST)
        }

        const updatedHireRequst = await this._hireDesignerRepo.updateHireDesigner(id, data);
        if (!updatedHireRequst) {
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



    async createHireDesigner(userId: string, data: HireDesignerPayload): Promise<IApiResponse<WarningDTO>> {
        const warnings: string[] = []

        const design = await this._designRepo.getDesign(data.designId)
        if (!design) {
            throw new AppError(DESIGNER_MESSAGES.DESIGNS.DESIGN_NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }

        // const designServices = new Set(...design.services);
        // const extraServices = data.services.filter(e => !designServices.has(e));
        // if (extraServices.length > 0) {
        //     throw new AppError<{ extraServices: string[] }>(JOB_MESSAGES.HIRE_DESIGNER.EXTRA_SERVICES, RESPONSE_CODE.BAD_REQUEST, { extraServices })
        // }

        const designArea = toSqFt(parseFloat(design.length), parseFloat(design.width), design.unit)
        const hireArea = toSqFt(parseFloat(data.length), parseFloat(data.width), data.unit)
        const difference = Math.abs(designArea - hireArea)
        const threshold = designArea * 0.5
        if (difference > threshold) {
            warnings.push(JOB_MESSAGES.HIRE_DESIGNER.AREA_MISMATCH)
        }

        const checkIfApplied = await this._hireDesignerRepo.checkIfApplied(userId, data.designId)
        if (checkIfApplied) {
            throw new AppError(JOB_MESSAGES.HIRE_DESIGNER.FAIL, RESPONSE_CODE.CONFILT)
        }

        const designerActiveJobs = (await this._activeJobRepo.getAllActiveJobPerDesigner(design.userId.id)).length;
        if (designerActiveJobs > 2) {
            warnings.push(JOB_MESSAGES.HIRE_DESIGNER.DESIGNER_BUSY)
        }

        const createData: CreateHireDesignerDTO = {
            ...data,
            userId: userId,
            projectTitle: design.name,
            maxBudget: design.maxPrice,
            minBudget: design.minPrice,
            status: HIRE_DESIGNER_STATUS.PENDING,
            designId: data.designId,
            designerId: design.userId.id
        }

        await this._hireDesignerRepo.createHireDesigner(createData)
        return {
            message: JOB_MESSAGES.HIRE_DESIGNER.CREATED,
            statuscode: RESPONSE_CODE.CREATED,
            data: { warnings }
        }
    }


    async deleteHireDesigenr(id: string): Promise<IApiResponse> {
        const hireRequest = await this._hireDesignerRepo.getHireDesignerById(id)
        if (!hireRequest) {
            throw new AppError(JOB_MESSAGES.HIRE_DESIGNER.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        if (hireRequest.status !== HIRE_DESIGNER_STATUS.PENDING) {
            throw new AppError(JOB_MESSAGES.HIRE_DESIGNER.DELETE_STATUS_NOT_PENDING, RESPONSE_CODE.BAD_REQUEST)
        }
        const isDeleted = await this._hireDesignerRepo.deleteHireDesigner(id)
        if (!isDeleted) {
            throw new AppError(JOB_MESSAGES.HIRE_DESIGNER.DELETE_FAIL, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        return { message: JOB_MESSAGES.HIRE_DESIGNER.DELETE }
    }

    async getMyHireDesignerRequests(userId: string, filters?: HireDesignerFilter): Promise<IApiResponseWithPagination<getMyHireDesignerRequestResponseDTO[]>> {
        const { data, pagination } = await this._hireDesignerRepo.getMyHireDesignerRequests(userId, filters);
        const hireDesignerData = HireDesignerMapper.toGetMyHireDesignerRequestDTOlist(data)
        return { message: JOB_MESSAGES.HIRE_DESIGNER.MY_REQUEST, data: hireDesignerData, total: pagination.total, totalPages: pagination.totalPages }
    }

    async getHireRequestPerDesign(designId: string, filters?: HireDesignerFilter): Promise<IApiResponseWithPagination<getHireDesignerPerDesignResponseDTO[]>> {
        const { data, pagination } = await this._hireDesignerRepo.getHireRequestPerDesign(designId, filters);
        const hireDesignerData = HireDesignerMapper.toGetHireDesignerPerDesignDTOlist(data)
        return { message: JOB_MESSAGES.HIRE_DESIGNER.MY_REQUEST, data: hireDesignerData, total: pagination.total, totalPages: pagination.totalPages }
    }

}