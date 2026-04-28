import type { ImageUploadResult } from "../../interfaces/base/IImageUpload.js";

export interface DesignFiles {
    coverImage: Express.Multer.File
    gallery: Express.Multer.File[]

}
export interface EditDesignFiles {
    coverImage?: Express.Multer.File
    gallery?: Express.Multer.File[]

}

export interface AddDesignRequestDTO {
    name: string;
    propertyType: string
    startingPrice: string;
    district: string;
    services: string[];
    designStyles: string[]
    description: string,
    spaceType: string
}



export interface EditDesign {
    name: string;
    description: string;
    designStyles: string[];
    services: string[];
    spaceType: string;
    propertyType: string;
    startingPrice: number;
    keptGallery?: ImageUploadResult[];
}


export type EditDesignRepoData = Omit<EditDesign, "keptGallery">

export interface createDesignDTO extends AddDesignRequestDTO {
    userId: string;
    coverImage: ImageUploadResult;
    gallery: ImageUploadResult[]
}



export interface getAllDesignsResponseDTO {
    name: string
    coverImage: string,
    price: string,
    description: string
    id: string
}



export interface DesignDetailResponseDTO {
    id: string;
    designerName: string;
    designName: string;
    propertyType: string;
    spaceType: string;
    startingPrice: string;
    services: string[];
    designStyles: string[];
    description: string;
    coverImage: ImageUploadResult;
    gallery: ImageUploadResult[];
    createdAt: string;
}




export interface DesignGallaryDTO {
    coverImage: string,
    designId: string
}



export interface DesignFilter {
    page?: string,
    designStyles?: string
    propertyTypes?: string
    spaceTypes?: string
    sortBy?: string
}


export interface GetAllDesignCommonResponseDTO {
    id: string
    name: string,
    spaceType: string,
    designStyles: string[]
    coverImage: string,
    budget: string,
    designerName: string
}