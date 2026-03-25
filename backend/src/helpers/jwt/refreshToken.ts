import jwt from "jsonwebtoken"
import { ensureError } from "../ensureError.js";


type Role = "Customer" | "Admin" | "Designer"

interface JwtPayload {
    email: string;
    userId: string;
    name: string
    role: Role;

}


export const jwtRefreshToken = (email: string, userId: string, name: string, role: string): string => {
    return jwt.sign({ email, userId, name, role }, process.env.REFRESH_TOKEN_SECRET_KEY as string, { expiresIn: "7d" })
}




export const refeshTokenVerificaion = (refreshToken:string) => {
    try {
       
        const decoded = jwt.verify(refreshToken , process.env.REFRESH_TOKEN_SECRET_KEY as string) as JwtPayload

        return decoded;

    } catch (error) {
        const err = ensureError(error).message
        console.log("from Refresh token verification: ",err) 
    }
}


