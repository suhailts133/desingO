import { client } from "../../config/redis.js";
import type { IBlackListRepository } from "../../interfaces/auth/IRefreshToken";

export class BlackListRepository implements IBlackListRepository{

    async storeToken(jti: string, ttl: number): Promise<string | null> {
        return await client.set(`blacklist:${jti}`, '1', { EX: ttl })
    }

    async getToken(jti: string): Promise<string | null> {
        return await client.get(`blacklist:${jti}`)
    }
}