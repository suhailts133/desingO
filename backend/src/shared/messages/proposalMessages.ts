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
        SERVICE_ORDER_MUST_START_FROM_ONE: "Service orders must start from 1",
        SERVICE_ORDER_NOT_CONTINUOUS: "Service orders must be continuous (1, 2, 3...)",
        SERVICES_REQUIRED: "Service is required",
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
    },
    PAYMENT: {
        NO_OPEN_SERVICE: "there are no open service with pending payment.",
        CREATED: "Payment created.",
        INTENT_NOT_CREATED: 'Failed to create payment intent',
    }

} as const