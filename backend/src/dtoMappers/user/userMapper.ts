import type { AdminUserDetailDTO, AdminUsersResponseDTO } from "../../DTO/admin/adminDTO";
import type { AuthResponseDTO, UserRepsonseDTO } from "../../DTO/auth/authDTO";
import type { DesignerProfileResponseDTO, UserProfileResponseDTO } from "../../DTO/profile/profileDTO";
import type { IDesignerPreference, IUser } from "../../interfaces/auth/IUser";
import type { IDesigner } from "../../interfaces/designer/IDesigner";
import type { IReview } from "../../interfaces/proposal/IProposal";
import { AUTH_PROVIDER_TYPES, USER_ROLES } from "../../shared/enums/commonEnums";

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

    static toAdminUserDTO(user: IUser, activeJobCount: number, designCount: number, review: IReview[]): AdminUserDetailDTO {
        const profileImage = user.profileImage?.path ?? user.profile_image_url;
        const rating = review.length > 0 ? review.reduce((acc, cur) => acc + cur.rating, 0) / review.length : 0;
        const authProvider = user.google_profile_id ? AUTH_PROVIDER_TYPES.GOOGLE : AUTH_PROVIDER_TYPES.LOCAL;
        return {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            authProvider,
            wallet: user.wallet,
            activeJobCount,
            role: user.role,
            is_blocked: user.is_blocked,
            joinedAt: user.createdAt.toLocaleDateString(),
            ...(user.role === USER_ROLES.DESIGNER && { designCount, rating }),
            ...(profileImage && { profileImage }),
        };
    }
    static toAdminUserDTOlist(users: IUser[]): AdminUsersResponseDTO[] {
        return users.map(user => {
            const profileImage = user.profileImage?.path ?? user.profile_image_url;
            return {
                id: user.id,
                full_name: user.full_name,
                email: user.email,

                role: user.role,
                ...(profileImage && { profileImage }),
                is_blocked: user.is_blocked,
                joinedAt: user.createdAt.toLocaleDateString()
            }
        })
    }
}