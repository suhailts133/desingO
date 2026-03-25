import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";
import { USER_ROLES } from "../helpers/enums/commonEnums.js";
import { RESPONSE_CODE } from "../helpers/enums/statusCode.js";
import { ensureError } from "../helpers/ensureError.js";

type Role = "Customer" | "Admin" | "Designer"

interface JwtPayload {
    email: string;
    userId: string;
    name: string
    role: Role;

}

function adminAuthentication(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader?.split(" ")[1];
        if (token === null) {
            return res.status(401).json({ message: "Access token missing" });
        }

        const decoded = jwt.verify(token as string, process.env.ACCESS_TOKEN_SECRET_KEY as string) as JwtPayload
        if (decoded.role === USER_ROLES.ADMIN) {
            req.user = decoded;
        } else {
            return res.status(RESPONSE_CODE.UNAUTHORIZED).json({ message: "You are not a admin", success: false })
        }
        next();
    } catch (error) {
        const err = ensureError(error).message
        console.log(err)
        return res.status(RESPONSE_CODE.UNAUTHORIZED).json({ message: "Invalid or expired token. Please login", success: false });
    }
}


export default adminAuthentication