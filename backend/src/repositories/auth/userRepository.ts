import type { CreateUserDTO, UserRepsonseDTO } from "../../DTO/auth/authDTO.js";
import type { IUser } from "../../interfaces/auth/IUser.js";
import type { IUserRepository } from "../../interfaces/auth/IUserRepository.js";
import { UserModel } from "../../models/user/userModel.js";
import { BaseRepository } from "../baseRepository.js";




export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
    
    constructor() {
        super(UserModel)
    }


    async delete(id: string): Promise<boolean> {
        const result = await this._model.findByIdAndDelete(id);
        return !!result;
    }


    async findEmail(email: string): Promise<boolean> {
        const result = await this.findOne({ email });
        return !!result
    }


    async findUser(email: string): Promise<IUser | null> {
        const result = await this.findOne({ email })
        return result
    }


    async updateUser(id: string, filters: Partial<IUser>): Promise<IUser | null> {
        const result = await this.update(id, filters);
        console.log("repo out: ", result)
        if (!result) {
            return null
        }
        return result
    }


    async createNewUser(data: CreateUserDTO): Promise<UserRepsonseDTO> {
        const result = await this.create(data);
        return {
            id: result._id.toString(),
            email: result.email,
            full_name: result.full_name,
            role: result.role
        }
    }


    async changePassword(email: string, password: string): Promise<boolean> {
        const result = await this._model.updateOne({ email }, { $set: { password } }).exec()
        return result.matchedCount > 0;
    }
}





