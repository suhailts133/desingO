
export interface ReviewPayload {
    rating: number;
    comment: string;
    sourceId: string
}

export interface ReviewResponseDTO {
    comment: string,
    rating: number
}

export interface ReviewListDTO extends ReviewResponseDTO {
    userName: string
    profileImage?: string
    createdAt: string,

}


export interface ReviewRepoDTO {
    jobId: string
    userId: string
    designerId: string
    rating: number
    userName: string
    profileImage?: string
    comment: string
}