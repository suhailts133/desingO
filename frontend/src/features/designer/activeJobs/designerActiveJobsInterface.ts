export interface ActiveJobResponseDTO {
    id: string,
    sourceType: 'jobRequest' | 'direct_hire'
    sourceName: string,
    sourceId: string,
    userName: string,
    profileImage?: string,
    status: 'Active' | 'Completed' | 'Cancelled',
    proposalStatus:"NOT_CREATED"|"CREATED"|"REJECTED"
    startedAt: string
}


export interface ActiveJobFilter {
    sourceType: 'jobRequest' | 'direct_hire'
    page?: number
}
