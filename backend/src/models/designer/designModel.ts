import mongoose, { Schema } from "mongoose"
import type { IDesign } from "../../interfaces/designer/IDesigner.js"
import type { ImageUploadResult } from "../../interfaces/base/IImageUpload.js"

const imageFormatSchema = new Schema<ImageUploadResult>({
    path: { type: String, required: true },
    filename: { type: String, required: true },
}, { _id: false })  


const designSchema = new Schema<IDesign>({
   userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
},
    name: { type: String, required: true },
    spaceType: { type: String , required:true},
    propertyType:{type:String, required:true},
    startingPrice: { type: String, required: true },
    description:{type:String, required:true},

    coverImage: { type: imageFormatSchema, required: true },
    gallery: {type:[imageFormatSchema], required:true, default:[]},
    designStyles: {type:[String], required:true, default:[]},
    services: {type:[String], required:true, default:[]},

}, { timestamps: true })

export const DesignModel = mongoose.model<IDesign>("Design", designSchema)