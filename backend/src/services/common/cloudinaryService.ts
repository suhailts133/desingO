import { v2 as cloudinary } from "cloudinary";

import type { ImageUploadResult, IImageUploaderService } from "../../interfaces/base/IImageUpload";


export class CloudinaryService implements IImageUploaderService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
            api_key: process.env.CLOUDINARY_API_KEY as string,
            api_secret: process.env.CLOUDINARY_API_SECRET as string
        });
    }

    async upload(file: Express.Multer.File, folder: string): Promise<ImageUploadResult> {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder, resource_type: "image" },
                (error, result) => {
                    if (error || !result) reject(error || new Error("Upload failed"));
                    else resolve({ path: result.secure_url, filename: result.public_id });
                }
            );
            stream.end(file.buffer);
        });
    }


    async uploadMany(files: Express.Multer.File[], folder: string): Promise<ImageUploadResult[]> {
        return Promise.all(
            files.map(f => this.upload(f, folder))
        )
    }

    async delete(publicId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) {
                    return reject(error);
                }
                if (result.result !== 'ok' && result.result !== 'not found') {
                    return reject(new Error(`Cloudinary delete failed: ${result.result}`));
                }
                resolve();
            });
        });
    }

    async deleteMany(publicIds: string[]): Promise<void> {
        await Promise.all(
            publicIds.map(id => this.delete(id))
        );
    }
}