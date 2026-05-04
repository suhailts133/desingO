import type { IUser } from "./IUser.js";

export interface IUserRepository{
    findEmail(email:string):Promise<boolean>;
    createNewUser(data:Partial<IUser>):Promise<IUser>
    changePassword(email:string, password:string):Promise<boolean>;
    findUser(email:string):Promise<IUser | null>;
    updateUser(id:string, filters:Partial<IUser>):Promise<IUser | null>
    findUserById(id:string):Promise<IUser | null>
}