import type { IUserTemp } from "./IUser";
export interface IOTPRepository {
    saveUserData(data: IUserTemp): Promise<string | null | undefined>;
    saveOTP(otp:string,email:string):Promise<boolean>
    getOTP(email:string):Promise<string | null>
    editOTP(otp:string,email:string):Promise<boolean>
    deleteOTP(email:string):Promise<number>
    editUserData(otp:string,email:string): Promise<boolean>;
    getUserData(email: string): Promise<IUserTemp | null>;
    deleteUserData(email: string): Promise<number>;
}