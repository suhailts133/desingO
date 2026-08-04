import type mongoose from "mongoose";
import type { GetAllDesignCommonResponseDTO } from "../../DTO/designer/designDTO";
import type { IApiResponse, IApiResponseWithPagination } from "../base/IApiResponse";
import type {  IDesignPopulated } from "../designer/IDesigner";
import type { Pagination } from "../../DTO/admin/adminDTO";

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