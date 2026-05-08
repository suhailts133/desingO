
export interface IRefreshToken {
    id:string,
    token:string,
    userId:string
    expiresAt:Date
}

export type RefreshTokenPayload = Omit<IRefreshToken, "id"> 

export interface IRefreshTokenRepository{
    storeToken(data:RefreshTokenPayload):Promise<IRefreshToken>,
    getRefreshToken(token:string):Promise<IRefreshToken | null>,
    deleteAllTokens(userId:string):Promise<number>
}

export interface IBlackListRepository{
    storeToken(jti:string, ttl:number):Promise<string | null>
    getToken(jti:string):Promise<string | null>
}