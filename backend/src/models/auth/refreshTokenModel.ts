import mongoose, { Schema, } from "mongoose";
import type { IRefreshToken } from "../../interfaces/auth/IRefreshToken.js";



const RefreshTokenSchema = new Schema<IRefreshToken>({
    userId: {type:String, required: true, unique:true },
    token:{type:String, required:true, unique:true},
    expiresAt:{type:Date, required:true}
    }
);

RefreshTokenSchema.index({expiresAt:1}, {expireAfterSeconds:0})

export const RefreshTokenModel = mongoose.model<IRefreshToken>(
    "RefreshToken",
    RefreshTokenSchema
);
