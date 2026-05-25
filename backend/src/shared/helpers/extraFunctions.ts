import mongoose from "mongoose";

export const isObjectId = (id: string): boolean => {
    return mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id
}

export const toSqFt = (length: number, width: number, unit: string) => {
    const area = length * width
    return unit === 'm' ? area * 10.764 : area 
}