import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";
import { USER_ROLES } from "../shared/enums/commonEnums.js";
import { RESPONSE_CODE } from "../shared/enums/statusCode.js";
import { ensureError } from "../shared/errors/ensureError.js";
import type { JwtPayloadAccessToken } from "../interfaces/base/IJwtToken.js";
import { BlackListRepository } from "../repositories/auth/blacklistRepository.js";
import { AUTH_MESSAGES } from "../shared/messages/authMessages.js";

const blacklistRepo = new BlackListRepository()

async function adminAuthentication(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader?.split(" ")[1];
        if (token === null) {
            return res.status(401).json({ message: AUTH_MESSAGES.AUTH.TOKEN_NOT_FOUND, success: false });
        }

        const decoded = jwt.verify(token as string, process.env.ACCESS_TOKEN_SECRET_KEY as string) as JwtPayloadAccessToken
        const isBlackListed = await blacklistRepo.getToken(decoded.jti)
        if (isBlackListed) {
            return res.status(RESPONSE_CODE.UNAUTHORIZED).json({ message: AUTH_MESSAGES.AUTH.TOKEN_REVOKED, success: false });
        }
        if (decoded.role === USER_ROLES.ADMIN) {
            req.user = decoded;
        } else {
            return res.status(RESPONSE_CODE.UNAUTHORIZED).json({ message: AUTH_MESSAGES.AUTH.NOT_ADMIN, success: false })
        }
        next();
    } catch (error) {
        const err = ensureError(error).message
        console.log(err)
        return res.status(RESPONSE_CODE.UNAUTHORIZED).json({ message: AUTH_MESSAGES.AUTH.TOKEN_INVALID, success: false });
    }
}


export default adminAuthentication