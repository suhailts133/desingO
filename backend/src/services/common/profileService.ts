import type { DesignerProfileResponseDTO, DesignerUpdateResponseDTO, UserProfileDTO, UserProfileResponseDTO, UserProfileUpdateDTO, } from "../../DTO/profile/profileDTO";
import { RESPONSE_CODE } from "../../shared/enums/statusCode";
import { AppError } from "../../shared/errors/appError";
import type { IUserRepository } from "../../interfaces/auth/IUserRepository";
import type { IApiResponse } from "../../interfaces/base/IApiResponse";
import type { IProfileService } from "../../interfaces/base/IProfile";
import type { IDesignerRepository } from "../../interfaces/designer/IDesignerRepository";
import { PROFILE_MESSAGES } from "../../shared/messages/profileMessages";
import { UserMapper } from "../../dtoMappers/user/userMapper";

export class ProfileService implements IProfileService {
    constructor(private _DesignerRepo: IDesignerRepository, private _userRepo: IUserRepository) { };


    async getUserProfile(userId: string): Promise<IApiResponse<UserProfileResponseDTO>> {
        const result = await this._userRepo.findUserById(userId);
        if (!result) {
            throw new AppError(PROFILE_MESSAGES.PROFILE.USER_NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        const data = UserMapper.toUserProfileDTO(result)
        return { statuscode: RESPONSE_CODE.OK, success: true, message: PROFILE_MESSAGES.PROFILE.USER_FOUND, data }
    }


    async updateUserProfile(userId: string, data: UserProfileUpdateDTO): Promise<IApiResponse<UserProfileDTO>> {
        const result = await this._userRepo.updateUser(userId, data);
        if (!result) {
            throw new AppError(PROFILE_MESSAGES.PROFILE.UPDATE_FAIL, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        const output: UserProfileDTO = {
            full_name: result.full_name,
            isGoogle: !!result.google_profile_id
        }
        return { success: true, message: PROFILE_MESSAGES.PROFILE.UPDATE_SUCCESS, statuscode: RESPONSE_CODE.OK, data: output }
    }

    async getDesignerProfile(designerId: string): Promise<IApiResponse<DesignerProfileResponseDTO>> {
        const designer = await this._DesignerRepo.getDesigner(designerId)
        if (!designer) {
            throw new AppError(PROFILE_MESSAGES.PROFILE.USER_NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        const userData = await this._userRepo.findUserById(designerId)
        if (!userData) {
            throw new AppError(PROFILE_MESSAGES.PROFILE.USER_NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        const designerData = UserMapper.toDesignerProfileDTO(userData, designer)

        return { statuscode: RESPONSE_CODE.OK, message: PROFILE_MESSAGES.PROFILE.USER_FOUND, data:designerData, success: true }
    }

    async updateDesignerProfile(designerId: string, data: DesignerUpdateResponseDTO): Promise<IApiResponse<DesignerUpdateResponseDTO>> {
        const { full_name, ...designerData } = data;
        const updatedDesigner = await this._DesignerRepo.updateDesigner(designerId, designerData);
        if (!updatedDesigner) {
            throw new AppError(PROFILE_MESSAGES.PROFILE.UPDATE_FAIL, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
        }

        const currentUser = await this._userRepo.findUserById(designerId);
        if (!currentUser) {
            throw new AppError(PROFILE_MESSAGES.PROFILE.USER_NOT_FOUND, RESPONSE_CODE.NOT_FOUND);
        }

        let finalUser = currentUser;
        if (full_name !== currentUser.full_name) {
            const updatedUser = await this._userRepo.updateUser(designerId, { full_name });
            if (!updatedUser) {
                throw new AppError(PROFILE_MESSAGES.PROFILE.UPDATE_FAIL, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
            }
            finalUser = updatedUser;
        }
        const output: DesignerUpdateResponseDTO = {
            phone: updatedDesigner.phone,
            bio: updatedDesigner.bio,
            state: updatedDesigner.state,
            district: updatedDesigner.district,
            city: updatedDesigner.city,
            full_name: finalUser.full_name,
            portfolioUrl: updatedDesigner.portfolioUrl
        };

        return {
            success: true, statuscode: RESPONSE_CODE.OK, message: PROFILE_MESSAGES.PROFILE.UPDATE_SUCCESS, data: output
        };
    }
}