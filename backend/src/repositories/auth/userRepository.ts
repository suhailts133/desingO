import type { CreateUserDTO } from "../../DTO/auth/authDTO.js";
import type { IUser, UserRole } from "../../interfaces/auth/IUser.js";
import type { IUserRepository } from "../../interfaces/auth/IUserRepository.js";
import { UserModel } from "../../models/user/userModel.js";
import { BaseRepository } from "../baseRepository.js";




export class UserRepository extends BaseRepository<IUser> implements IUserRepository {

    constructor() {
        super(UserModel)
    }


    async findByRole(role: UserRole): Promise<IUser | null> {
        return await this.findOne({role})
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
        if (!result) {
            return null
        }
        return result
    }


    async createNewUser(data: CreateUserDTO): Promise<IUser> {
        return await this.create(data);
    }

    async changePassword(email: string, password: string): Promise<IUser | null> {

        return await this._model.findOneAndUpdate({ email }, { $set: { password } }, { returnDocument: "after" });
    }
    async findUserById(id: string): Promise<IUser | null> {
        const result = await this.findById(id);
        if (!result) {
            return null
        }
        return result
    }
}





