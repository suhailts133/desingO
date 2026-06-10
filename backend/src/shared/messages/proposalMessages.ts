export const PROPOSAL_MESSAGES = {


    VERSION: {
        NOT_FOUND: "version not found.",
        UPDATE_FAIL: "version update fail.",
        UPDATE_SUCCESS: "version update success.",
    },

    SERVICE: {
        SERVICE_RESULT_REQUIRED: "Service result is required.",
        SUCCESS: "Result upload success.",
        NOT_FOUND: "Service not found.",
        UPDATE_FAIL: "Failed to update the service.",
        CANNOT_OPEN: "Failed to Open the next service.",
        CANNOT_COMPLETE: "Failed to set the current service as complete."

    },
    PROPOSAL: {
        CREATION_FAILED: "Proposal creation failed.",
        EXISTS: "Proposal already exists.",
        CONTRACT_STATUS_FAIL: "Failed to update the contract status.",
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
        PAYOUT_NOT_FOUND: 'payout amount not found contact support',
        PAYOUT_DESIGNER_FAILED: 'Cannot pay designer contact support',
        PAYOUT_ADMIN_FAILED: 'Cannot pay admin contact support',
    }

} as const