export const PROPOSAL_MESSAGES = {

    PROPOSAL: {
        CREATION_FAILED: "Proposal creation failed.",
        EXISTS: "Proposal already exists.",
        CREATION_SUCCESS: "Proposal creation success.",
        FETCH_SUCCESS: "Proposal fetched Successfully.",
        NOT_FOUND: "Proposal not found.",
        STATUS_CHANGED: "Proposal status changed.",
        PRICE_MISMATCH: (expected: number, total: number) => `Invalid total drawing fee. Expected ${expected}, but received ${total}.`,
        TEMPLATE_FETCH_SUCCESS: "Proposal template fetched success.",
        STATUS_UPDATION_FAILED: "failed to update status of the proposal.",
    },
    PROPOSAL_INPUT: {
        TEMPLATE_FETCH_SUCCESS: "Proposal template fetched success.",
        UNKONW_DATA: "data can either be 'job request' or 'direct hire'"
    },
    REVIEW: {
        NOT_ELIGIBLE: "You are not eligible to post a review.",
        SUCCESS: "Review post successfully.",
        ALREADY_REVIEWD: "You have already added a review for this job.",
        ERROR: "Review posting failed.",
        FETCH_ALL: "Fetch all review success.",
        FETCH_FAILED: "Failed to fetch reviews.",
    }

} as const