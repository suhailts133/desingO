import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid"
export const isObjectId = (id: string): boolean => {
    return mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id
}

export const toSqFt = (length: number, width: number, unit: string) => {
    const area = length * width
    return unit === 'm' ? area * 10.764 : area
}



export const toCleanRegExp = (string: string): RegExp => {
    const cleanString = string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return new RegExp(`^${cleanString}`, "i")
};


export const generateUniqueId = (prefix: string): string => {
    const uniqueString = uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();
    return `${prefix}-${uniqueString}`;
}
