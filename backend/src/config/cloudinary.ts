import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string
})

export const uploadToCloudinary = (file: Express.Multer.File, folder: string): Promise<{ path: string, filename: string }> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: "image" },
            (error, result) => {
                if (error || !result){
                    reject(error || "upload Failed")  
                } 
                else resolve({
                    path: result.secure_url,
                    filename: result.public_id
                })
            }
        )
        stream.end(file.buffer)
    })
}