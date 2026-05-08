import {type JwtPayload } from "jsonwebtoken";

type Role = "Customer" | "Admin" | "Designer"

export interface JwtPayloadAccessToken extends JwtPayload {
    email: string;
    userId: string;
    name: string;
    role: Role
    jti:string
    exp:number
}