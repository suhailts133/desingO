import type { IUser } from "../interfaces/auth/IUser.js";


export interface UserWithIdDTO extends IUser {
    id:string
}