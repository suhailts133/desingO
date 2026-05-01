export interface ImageUploadResult {
    filename:string,
    path:string,
}

export interface DesignerProfileDTO {
    isGoogle: boolean
    full_name: string;
    bio: string
    phone: string;
    state: string
    city: string;
    district: string;
    portfolioUrl:string
}


export interface DesignerProfileResponseDTO extends DesignerProfileDTO {
    profileImage?: string
    profile_image_url?: string;
}



export type DesignerUpdateRequestDTO = Omit<DesignerProfileDTO, "full_name" | "isGoogle">;
export type DesignerUpdateResponseDTO = Omit<DesignerProfileDTO, "isGoogle">;


export interface IProfileImage {
  profileImage: FileList;
}




