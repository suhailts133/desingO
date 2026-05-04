import type {UserFilterDTO,Pagination } from "../../DTO/admin/adminDTO.js";
import type { IUser } from "../auth/IUser.js";


export interface IUserManagementRepository{
    getAllUsers(filter?:UserFilterDTO):Promise<{data: IUser[], pagination:Pagination}>
    getUser(id:string):Promise<IUser | null>
    toggleUser(id:string, is_blocked:boolean):Promise<IUser | null>

}