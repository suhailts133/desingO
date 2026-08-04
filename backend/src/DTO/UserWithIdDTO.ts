import type { IUser } from "../interfaces/auth/IUser";


export interface UserWithIdDTO extends IUser {
    id:string
}