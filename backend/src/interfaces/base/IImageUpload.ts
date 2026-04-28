export interface ImageUploadResult {
    path: string;
    filename: string;
}

export interface IImageUploaderService {
    upload(file: Express.Multer.File, folder: string): Promise<ImageUploadResult>;
    uploadMany(files: Express.Multer.File[], folder: string): Promise<ImageUploadResult[]>;
    delete(publicId: string): Promise<void>;
    deleteMany(publicIds: string[]): Promise<void>;
}
