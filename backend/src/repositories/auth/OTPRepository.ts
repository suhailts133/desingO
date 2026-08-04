import { client } from "../../config/redis";
import type { IOTPRepository } from "../../interfaces/auth/IOtpRepository";
import type { IUserTemp } from "../../interfaces/auth/IUser";


export class OtpRepository implements IOTPRepository {


    async saveOTP(otp: string, email: string): Promise<boolean> {
            const res = await client.set(email, otp, { EX: 300 })
            if (!res) {
                return !!res
            }
            return !!res
    }


    async getOTP(email: string): Promise<string | null> {
            const result = await client.get(email);
            return result
    }


    async editOTP(otp: string, email: string): Promise<boolean> {
            const result = await client.set(email, otp, { EX: 300 })
            if (!result) {
                return false
            }
            return true
    }


    async deleteOTP(email: string): Promise<number> {
            const val = await client.del(email)
            return val      
    }


    async saveUserData(data: IUserTemp): Promise<string | null | undefined> {
            const res = await client.set(data.email, JSON.stringify(data), { EX: 300 });
            return res

    }


    async getUserData(email: string): Promise<IUserTemp | null> {
            const result = await client.get(email);
            if(!result){
                return null
            }
            const val: IUserTemp = JSON.parse(result as string);
            return val
    }


    async editUserData(otp: string, email: string): Promise<boolean> {
            const data = await client.get(email);
            if (!data) {
                return false
            }
            const val: IUserTemp = JSON.parse(data as string);
            val["otp"] = otp;
            const res = await client.set(email, JSON.stringify(val), { EX: 300 });
            if(res){
                return true
            }
            return false
    }


    async deleteUserData(email: string): Promise<number> {
            const val = await client.del(email)
            return val
    }

}