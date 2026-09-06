import type { AdminUsersResponseDTO } from "../../DTO/admin/adminDTO";
import type { AuthResponseDTO, UserRepsonseDTO } from "../../DTO/auth/authDTO";
import type { IUser } from "../../interfaces/auth/IUser";

export class UserMapper {
    static toResponseDTO(user: IUser): UserRepsonseDTO {
        return {
            id: user.id.toString(),
            name: user.full_name,
            email: user.email,
            role: user.role
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