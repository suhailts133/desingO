import type { Socket } from "socket.io";
import type { JwtPayloadAccessToken } from "../interfaces/base/IJwtToken";

export interface AuthSocket extends Socket {
    user?: JwtPayloadAccessToken
}

