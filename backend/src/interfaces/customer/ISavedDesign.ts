import type mongoose from "mongoose";
import type { GetAllDesignCommonResponseDTO } from "../../DTO/designer/designDTO.js";
import type { IApiResponse, IApiResponseWithPagination } from "../base/IApiResponse.js";
import type {  IDesignPopulated } from "../designer/IDesigner.js";
import type { Pagination } from "../../DTO/admin/adminDTO.js";

export interface ISavedDesignDTO {
    isSaved: boolean,
    designId: string
}




export interface ISavedDesignService {
    addOrRemoveDesign(data: ISavedDesignDTO, userId:string): Promise<IApiResponse<boolean>>;
    getSavedDesigns(userId:string, page?: string): Promise<IApiResponseWithPagination<GetAllDesignCommonResponseDTO[]>>;
}
export interface ISavedDesignRepository {
    getSavedDesigns(designArr: mongoose.Types.ObjectId[], pageNo?: string): Promise<{ data: IDesignPopulated[]; pagination: Pagination; }>
}