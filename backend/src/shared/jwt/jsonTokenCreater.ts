import jwt from "jsonwebtoken"
import type {StringValue} from "ms"

export const jwtAccessToken = (email: string, userId: string, name:string, role:string): string => {
    return jwt.sign({ email, userId,name,role }, process.env.ACCESS_TOKEN_SECRET_KEY as string, { expiresIn: process.env.ACCESS_TOKEN_EXP_IN as StringValue })
}