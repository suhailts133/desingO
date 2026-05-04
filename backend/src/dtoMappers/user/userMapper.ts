import type { AdminUsersResponseDTO } from "../../DTO/admin/adminDTO.js";
import type { AuthResponseDTO, UserRepsonseDTO } from "../../DTO/auth/authDTO.js";
import type { IUser } from "../../interfaces/auth/IUser.js";

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
        return {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            role: user.role,
            is_blocked: user.is_blocked,
            joinedAt: user.createdAt.toISOString()
        };
    }
    static toAdminUserDTOlist(users: IUser[]): AdminUsersResponseDTO[] {
        return users.map(UserMapper.toAdminUserDTO)
    }
}