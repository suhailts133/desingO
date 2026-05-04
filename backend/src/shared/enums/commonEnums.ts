export enum USER_ROLES {
    CUSTOMER = "Customer",
    DESIGNER = "Designer",
    ADMIN = "Admin"
}


export enum DESIGNER_STATUS {
    APPROVED = "Approved",
    REJECTED = "Rejected",
    PENDING = "Pending"
}


export enum CLOUDINARY_FOLDER_NAME {
    CERTIFICATES = "designer/certificates",
    WORK_PROOF = "designer/proof",
    GOVT = "designer/govt-id",
    COVER_IMAGES = "designer/coverImages",
    GALLERY = "designer/gallery",
    PROFILE_IMAGES = "common/profileImages",
    REFERENCE_IMAGES = "jobRequest/refrenceImages"
}


export enum JOB_REQUEST_STATUS {
    PENDING = "Pending",
    ONGOING = "Ongoing",
    CLOSED = "Closed",
}
export enum JOB_APPLICATION_STATUS {
    PENDING = "Pending",
    ONGOING = "Ongoing",
    COMPLETED = "Completed",
    REJECTED = "Rejected"
}