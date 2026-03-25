import type { CloudinaryImageFormat } from "../../interfaces/designer/IDesigner.js";


export interface WorkExperienceWithImage extends WorkExperience {
    proof: CloudinaryImageFormat
}

export interface EducationWithImage extends Education {
    certification: CloudinaryImageFormat
}



type GovernmentIdType = "aadhar_card" | "driving_licence"

export interface Education {
    institutionName: string;
    courseName: string;
    completionYear: string;

}



export interface WorkExperience {
    companyName: string;
    role: string;
    yearsOfExperience: string;
}


export interface DesignerVerificationBodyDTO {
    phone: string;
    state: string
    city: string;
    district: string;
    governmentIdType: GovernmentIdType;
    education: Education[]
    workExperience?: WorkExperience[]
    portfolioUrl: string
}



export interface DesignerVerificationDTO {
    userId: string;
    phone: string;
    state: string
    city: string;
    district: string;
    governmentIdType: GovernmentIdType;
    govtIdImage: CloudinaryImageFormat;
    education: EducationWithImage[]
    workExperience?: WorkExperienceWithImage[]
    portfolioUrl: string
}