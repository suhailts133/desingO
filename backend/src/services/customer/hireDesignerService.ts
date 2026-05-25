import type { CreateHireDesignerDTO, getHireDesignerPerDesignResponseDTO, getMyHireDesignerRequestResponseDTO, HireDesignerFilter } from "../../DTO/user/hireDesignerDTO.js";
import { HireDesignerMapper } from "../../dtoMappers/user/hireDesignerMapper.js";
import type { IApiResponse, IApiResponseWithPagination } from "../../interfaces/base/IApiResponse.js";
import type { WarningDTO } from "../../interfaces/benchmark/IBenchMark.js";
import type { HireDesignerPayload } from "../../interfaces/customer/ICustomer.js";
import type { IActiveJobRepository, IHireDesignerRepository } from "../../interfaces/customer/ICustomerRepository.js";
import type { IHireDesignerService } from "../../interfaces/customer/ICustomerService.js";
import type { IDesignRepository } from "../../interfaces/designer/IDesignerRepository.js";
import { RESPONSE_CODE } from "../../shared/enums/statusCode.js";
import { AppError } from "../../shared/errors/appError.js";
import { toSqFt } from "../../shared/helpers/extraFunctions.js";
import { DESIGNER_MESSAGES } from "../../shared/messages/designerMessages.js";
import { JOB_MESSAGES } from "../../shared/messages/jobMessages.js";

export class HireDesignerService implements IHireDesignerService {
    constructor(private _hireDesignerRepo: IHireDesignerRepository, private _designRepo: IDesignRepository, private _activeJobRepo: IActiveJobRepository) { }
    async createHireDesigner(userId: string, data: HireDesignerPayload): Promise<IApiResponse<WarningDTO>> {
        const warnings: string[] = []

        const design = await this._designRepo.getDesign(data.designId)
        if (!design) {
            throw new AppError(DESIGNER_MESSAGES.DESIGNS.DESIGN_NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }

        const designServices = new Set(...design.services);
        const extraServices = data.services.filter(e => !designServices.has(e));
        if (extraServices.length > 0) {
            throw new AppError<{ extraServices: string[] }>(JOB_MESSAGES.HIRE_DESIGNER.EXTRA_SERVICES, RESPONSE_CODE.BAD_REQUEST, { extraServices })
        }

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
            spaceType: design.spaceType,
            userId: userId,
            designId: data.designId,
            designerId: design.userId.id
        }

        await this._hireDesignerRepo.createHireDesigner(createData)
        return {
            message: JOB_MESSAGES.HIRE_DESIGNER.CREATED,
            statuscode: RESPONSE_CODE.CREATED,
            data: {warnings}
        }
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