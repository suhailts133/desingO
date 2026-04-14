export interface IEducation {
    institutionName: string;
    courseName: string;
    completionYear: number;
    certificateImage: FileList | null;
}

export interface IWorkExperience {
    companyName: string;
    role: string;
    yearsOfExperience: number;
    proofImage?: FileList | null;
}

export interface IDesignerProfile {
    phone: string;
    state: string;
    district: string;
    city: string;
    governmentIdType: "aadhar_card" | "driving_licence";
    governmentIdImage: FileList | null;
    education: IEducation[];
    workExperience?: IWorkExperience[];
    portfolioUrl: string;
    bio:string;
}

