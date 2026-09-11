import type { AdminUsersResponseDTO } from "../../DTO/admin/adminDTO";
import type { AuthResponseDTO, UserRepsonseDTO } from "../../DTO/auth/authDTO";
import type { DesignerProfileResponseDTO, UserProfileResponseDTO } from "../../DTO/profile/profileDTO";
import type { IDesignerPreference, IUser } from "../../interfaces/auth/IUser";
import type { IDesigner } from "../../interfaces/designer/IDesigner";

export class UserMapper {
    static toResponseDTO(user: IUser): UserRepsonseDTO {
        return {
            id: user.id.toString(),
            name: user.full_name,
            email: user.email,
            role: user.role
        }
    }

    static toDesignerProfileDTO(userData: IUser, designerData: IDesigner): DesignerProfileResponseDTO {
        const preferenceData: IDesignerPreference = {
            ...(userData.designerPreference?.designStyle && { designStyle: userData.designerPreference.designStyle }),
            ...(userData.designerPreference?.propertyType && { propertyType: userData.designerPreference.propertyType })
        }
        return {
            prefernces: preferenceData,
            isGoogle: !!userData.google_profile_id,
            full_name: userData.full_name,
            district: designerData.district,
            state: designerData.state,
            city: designerData.city,
            bio: designerData.bio,
            phone: designerData.phone,
            portfolioUrl: designerData.portfolioUrl,
            ...(userData.profileImage !== undefined && { profileImage: userData.profileImage.path }),
            ...(userData.profile_image_url !== undefined && { profile_image_url: userData.profile_image_url }),
        }
    }

    static toUserProfileDTO(data: IUser): UserProfileResponseDTO {
        return {
            isGoogle: !!data.google_profile_id,
            full_name: data.full_name,
            ...(data.profileImage !== undefined && { profileImage: data.profileImage }),
            ...(data.profile_image_url !== undefined && { profile_image_url: data.profile_image_url }),
        }
    }

    static toAuthResponseDTO(user: IUser, accessToken: string, refreshToken: string): AuthResponseDTO {
        const userData = UserMapper.toResponseDTO(user);
        return {
            user: userData,
            jwtToken: accessToken,
            refreshToken: refreshToken,
        };
    }

    static toAdminUserDTO(user: IUser): AdminUsersResponseDTO {
        const profileImage = user.profileImage?.path ?? user.profile_image_url;

        return {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            wallet: user.wallet,
            role: user.role,
            ...(profileImage && { profileImage }),
            is_blocked: user.is_blocked,
            joinedAt: user.createdAt.toLocaleDateString()
        };
    }
    static toAdminUserDTOlist(users: IUser[]): AdminUsersResponseDTO[] {
        return users.map(UserMapper.toAdminUserDTO)
    }
}