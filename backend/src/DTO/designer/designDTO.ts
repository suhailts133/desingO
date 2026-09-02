import type { ImageUploadResult } from "../../interfaces/base/IImageUpload";

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
    minPrice: number;
    maxPrice: number;
    district: string;
    services: string[];
    designStyles: string[]
    description: string,
    spaceType: string,
    length: string,
    unit: "ft" | "m",
    width: string
}



export interface EditDesign {
    name: string;
    description: string;
    designStyles: string[];
    services: string[];
    spaceType: string;
    propertyType: string;
    minPrice: number;
    maxPrice: number;
    keptGallery?: ImageUploadResult[];
}


export type EditDesignRepoData = Omit<EditDesign, "keptGallery">

export interface createDesignDTO extends AddDesignRequestDTO {
    userId: string;
    coverImage: ImageUploadResult;
    gallery: ImageUploadResult[]
    embedding:number[]
}



export interface getAllDesignsResponseDTO {
    name: string
    coverImage: string,
    minPrice: string,
    maxPrice: string,
    description: string
    id: string
}



export interface DesignDetailResponseDTO {
    id: string;
    designerName: string;
    designName: string;
    designerId: string;
    propertyType: string;
    spaceType: string;
    minPrice: string;
    maxPrice: string;
    services: string[];
    designStyles: string[];
    description: string;
    coverImage: ImageUploadResult;
    gallery: ImageUploadResult[];
    createdAt: string;
    isSaved: boolean
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
    minPrice: string,
    maxPrice: string,
    designerName: string,
    isSaved: boolean
}