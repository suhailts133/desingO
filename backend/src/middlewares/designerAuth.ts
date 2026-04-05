import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";
import { USER_ROLES } from "../helpers/enums/commonEnums.js";
import { RESPONSE_CODE } from "../helpers/enums/statusCode.js";
import { ensureError } from "../helpers/errors/ensureError.js";

type Role = "Customer" | "Admin" | "Designer"

interface JwtPayload {
    email: string;
    userId: string;
    name: string
    role: Role;

}

function designerAuthentication(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader?.split(" ")[1];
        if (token === null) {
            return res.status(401).json({ message: "Access token missing", success: false });
        }

        const decoded = jwt.verify(token as string, process.env.ACCESS_TOKEN_SECRET_KEY as string) as JwtPayload
        if (decoded.role === USER_ROLES.DESIGNER) {
            req.user = decoded;
        } else {
            return res.status(RESPONSE_CODE.UNAUTHORIZED).json({ message: "You are not a Designer", success: false })
        }
        next()
    } catch (error) {
        const err = ensureError(error).message;
        console.log(err)
        return res.status(RESPONSE_CODE.UNAUTHORIZED).json({ message: "Invalid or expired token", success: false });
    }
}


export default designerAuthentication