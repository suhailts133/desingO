import type { IUser, UserRole } from "./IUser";

export interface IUserRepository{
    findEmail(email:string):Promise<boolean>;
    findByRole(role:UserRole):Promise<IUser | null>
    createNewUser(data:Partial<IUser>):Promise<IUser>
    changePassword(email:string, password:string):Promise<IUser | null>;
    findUser(email:string):Promise<IUser | null>;
    updateUser(id:string, filters:Partial<IUser>):Promise<IUser | null>
    findUserById(id:string):Promise<IUser | null>
    
}