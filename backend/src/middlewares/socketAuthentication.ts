import jwt from "jsonwebtoken";
import { ensureError } from "../shared/errors/ensureError.js";
import type { JwtPayloadAccessToken } from "../interfaces/base/IJwtToken.js";
import { BlackListRepository } from "../repositories/auth/blacklistRepository.js";
import { AUTH_MESSAGES } from "../shared/messages/authMessages.js";
import type { AuthSocket } from "../socket/SocketType.js";

const blacklistRepo = new BlackListRepository();

async function socketAuthenticate(socket: AuthSocket, next: (err?: Error) => void) {
    try {

        const token = socket.handshake.auth?.token || socket.handshake.headers["authorization"]?.split(" ")[1];

        if (!token) {
            return next(new Error(AUTH_MESSAGES.AUTH.TOKEN_NOT_FOUND));
        }

        const decoded = jwt.verify(
            token as string,
            process.env.ACCESS_TOKEN_SECRET_KEY as string
        ) as JwtPayloadAccessToken;

        const isBlackListed = await blacklistRepo.getToken(decoded.jti);

        if (isBlackListed) {
            return next(new Error(AUTH_MESSAGES.AUTH.TOKEN_REVOKED));
        }

        socket.user = decoded;
        next();
    } catch (error) {
        const err = ensureError(error).message;
        console.log(err);
        return next(new Error(AUTH_MESSAGES.AUTH.TOKEN_INVALID));
    }
}

export default socketAuthenticate;