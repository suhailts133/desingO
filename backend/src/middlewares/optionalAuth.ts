import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";
import { RESPONSE_CODE } from "../shared/enums/statusCode";
import { ensureError } from "../shared/errors/ensureError";
import type { JwtPayloadAccessToken } from "../interfaces/base/IJwtToken";
import { BlackListRepository } from "../repositories/auth/blacklistRepository";
import { AUTH_MESSAGES } from "../shared/messages/authMessages";

const blacklistRepo = new BlackListRepository()

async function optionalAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader?.split(" ")[1];
        if (token) {
            const decoded = jwt.verify(token as string, process.env.ACCESS_TOKEN_SECRET_KEY as string) as JwtPayloadAccessToken
            const isBlackListed = await blacklistRepo.getToken(decoded.jti)
            if (isBlackListed) {
                return res.status(RESPONSE_CODE.UNAUTHORIZED).json({ message: AUTH_MESSAGES.AUTH.TOKEN_REVOKED, success: false });
            }
            req.user = decoded;
        }
        next();
    } catch (error) {
        const err = ensureError(error).message
        console.log(err)
        return res.status(RESPONSE_CODE.UNAUTHORIZED).json({ success: false, message: AUTH_MESSAGES.AUTH.TOKEN_INVALID });
    }
}


export default optionalAuth