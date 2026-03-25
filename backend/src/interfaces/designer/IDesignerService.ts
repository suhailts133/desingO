import type { AddDesignRequestDTO, DesignDetailResponseDTO, DesignFiles, DesignFilter, GetAllDesignCommonResponseDTO, getAllDesignsResponseDTO } from "../../DTO/designer/designDTO.js";
import type { DesignerVerificationBodyDTO } from "../../DTO/designer/designerVerificationDTOs.js";
import type {IApiResponse, IApiResponseWithPagination } from "../base/IApiResponse.js";
import type { DesignerVerificationFiles } from "./IDesigner.js";

export interface IDesignerService{
    designerVerification(userId:string, email:string, data:DesignerVerificationBodyDTO,files:DesignerVerificationFiles):Promise<IApiResponse>
    addDesign(userId:string, data:AddDesignRequestDTO,files:DesignFiles):Promise<IApiResponse>
    getAllDesigns(userId:string, page?:string):Promise<IApiResponseWithPagination<getAllDesignsResponseDTO[]>>
    getDesignDetail(designId:string):Promise<IApiResponse<DesignDetailResponseDTO>>
    getAllDesignCommon(designFilter?:DesignFilter):Promise<IApiResponseWithPagination<GetAllDesignCommonResponseDTO[]>>
     deleteADesign(id:string):Promise<IApiResponse>
}