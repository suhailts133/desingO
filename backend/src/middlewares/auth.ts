import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";
import { RESPONSE_CODE } from "../helpers/enums/statusCode.js";
import { ensureError } from "../helpers/errors/ensureError.js";
type Role = "Customer" | "Admin" | "Designer"

export interface JwtPayloadAccessToken {
    email: string;
    userId: string;
    name: string;
    role: Role
}

function authenticate(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader?.split(" ")[1];
        if (token === null) {
            return res.status(RESPONSE_CODE.UNAUTHORIZED).json({ message: "Access token missing", success: false });
        }
        const decoded = jwt.verify(token as string, process.env.ACCESS_TOKEN_SECRET_KEY as string) as JwtPayloadAccessToken
        req.user = decoded;
        next();
    } catch (error) {
        const err = ensureError(error).message
        console.log(err)
        return res.status(RESPONSE_CODE.UNAUTHORIZED).json({ success: false, message: "Invalid or expired token" });
    }
}


export default authenticate