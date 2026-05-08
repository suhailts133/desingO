import type { IRefreshToken, IRefreshTokenRepository, RefreshTokenPayload } from "../../interfaces/auth/IRefreshToken.js";
import { RefreshTokenModel } from "../../models/auth/refreshTokenModel.js";
import { BaseRepository } from "../baseRepository.js";

export class RefreshTokenRepositoy extends BaseRepository<IRefreshToken> implements IRefreshTokenRepository {
    constructor(){
        super(RefreshTokenModel)
    }
    async storeToken(data: RefreshTokenPayload): Promise<IRefreshToken> {
        return await this.create(data)
    }

    async getRefreshToken(token: string): Promise<IRefreshToken | null> {
        return await this.findOne({ token })
    }

    async deleteAllTokens(userId: string): Promise<number> {
        const result = await this._model.deleteMany({ userId });
        return result.deletedCount
    }
}