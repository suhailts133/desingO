export interface DesignerCardDTO {
    full_name: string,
    joinedAt: string,
    google_profil_img?: string
    profileImg?: string
    bio: string
    designerId: string,
    state:string
    district:string
}



export interface DesignerFilter {
    full_name?: string,
    page: string
}

export interface DesignGallary {
    coverImage: string,
    designId: string
}


export interface DesignerDetailDTO extends DesignerCardDTO {
    designGallary: DesignGallary[]
    totalDesigns: number
}

