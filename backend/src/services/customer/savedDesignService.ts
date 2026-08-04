import mongoose from "mongoose";
import type { GetAllDesignCommonResponseDTO } from "../../DTO/designer/designDTO";
import { DesignMapper } from "../../dtoMappers/designer/designMapper";
import type { IUserRepository } from "../../interfaces/auth/IUserRepository";
import type { IApiResponse, IApiResponseWithPagination } from "../../interfaces/base/IApiResponse";
import type { ISavedDesignDTO, ISavedDesignRepository, ISavedDesignService } from "../../interfaces/customer/ISavedDesign";
import type { IDesignRepository } from "../../interfaces/designer/IDesignerRepository";
import { RESPONSE_CODE } from "../../shared/enums/statusCode";
import { AppError } from "../../shared/errors/appError";
import { AUTH_MESSAGES } from "../../shared/messages/authMessages";
import { DESIGNER_MESSAGES } from "../../shared/messages/designerMessages";

export class SavedDesignService implements ISavedDesignService {
    constructor(private _savedDesignRepo: ISavedDesignRepository, private _userRepo: IUserRepository, private _DesignRepo: IDesignRepository) { }

    async addOrRemoveDesign(data: ISavedDesignDTO, userId: string): Promise<IApiResponse<boolean>> {
        console.log(data)
        const user = await this._userRepo.findUserById(userId);
        if (!user) {
            throw new AppError(AUTH_MESSAGES.USER.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        const designId = new mongoose.Types.ObjectId(data.designId);
        if (data.isSaved) {
            user.savedDesigns.push(designId);
        } else {
            user.savedDesigns = user.savedDesigns.filter(d => d.toString() !== designId.toString())
        }
        const updatedUser = await this._userRepo.updateUser(userId, { savedDesigns: user.savedDesigns });
        if (!updatedUser) {
            throw new AppError(DESIGNER_MESSAGES.SAVED_DEIGN.UPATE_FAIL, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        return { message: DESIGNER_MESSAGES.SAVED_DEIGN.UPATE_SUCCESS, data: data.isSaved }
    }

    
    async getSavedDesigns(userId: string, page?: string): Promise<IApiResponseWithPagination<GetAllDesignCommonResponseDTO[]>> {
    
        const user = await this._userRepo.findUserById(userId)
        if (!user) {
            throw new AppError(AUTH_MESSAGES.USER.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        const designs = await this._savedDesignRepo.getSavedDesigns(user.savedDesigns, page);
        const savedSet = new Set(designs.data.map(d => d.id));
        const savedDesigns = DesignMapper.toDesignsDTOlist(designs.data, savedSet);

        return { message: DESIGNER_MESSAGES.SAVED_DEIGN.SAVED_DESIGN, data: savedDesigns, total: designs.pagination.total, totalPages: designs.pagination.totalPages }
    }
}