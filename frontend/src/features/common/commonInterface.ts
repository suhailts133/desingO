export interface DesignerCardDTO {
    full_name: string,
    joinedAt: string,
    google_profil_img?: string
    profileImg?: string
    bio: string
    designerId: string,
    state: string
    district: string
}

export interface DesignerFilter {
    full_name?: string,
    page: number
}

export interface DesingerFilterForm {
    full_name: string
}


export interface DesignGallaryDTO {
    coverImage:string,
    designId:string
}


export interface ISavedDesignDTO {
    isSaved: boolean,
    designId: string
}

