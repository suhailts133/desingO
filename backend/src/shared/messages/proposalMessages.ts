export const PROPOSAL_MESSAGES = {

    DISPUTE: {
        ONGOING: "A Dispute is already on going please wait till it get resolved.",
        SUCCESS: "Successfully reported the issue.",
        NOT_FOUND: "Dispute not found.",
        NOT_DISPUTED: "Either part hasnet risen a ticket.",
        DECISION_PENDING: "Admin has yet to make a decision.",
        UPDATION_FAILED: "Updation failed",
        UPDATION_SUCCESS: "Updation success.",
        EVIDENCE: "Evidence of the wrong doing is required.",
        FETCH_ALL: "Fetch all disputes.",
        FETCH_ONE: "Fetch a dispute.",
        PAYMENT_NOT_FOUND: "Payment Not found.",
        REFEUND_EXCEEDS: "Refend amount exceed the aloted payout.",
        ZERO: "Refend amount cannot to less then zero",
        ID_REQUIRED: "Dispute Id required",
    },

    VERSION: {
        NOT_FOUND: "version not found.",
        UPDATE_FAIL: "version update fail.",
        UPDATE_SUCCESS: "version update success.",
    },

    SERVICE: {
        SERVICE_RESULT_REQUIRED: "Service result is required.",
        SUCCESS: "Result upload success.",
        NOT_FOUND: "Service not found.",
        NOT_PAID: "Customer has not paid for this service",
        UPDATE_FAIL: "Failed to update the service.",
        CANNOT_OPEN: "Failed to Open the next service.",
        CANNOT_COMPLETE: "Failed to set the current service as complete."

    },
    PROPOSAL: {
        FLOOR_PLAN_REQUIRED: "Floor plan  is required.",
        FLOOR_PLAN_UPLOADED: "Floor plan uploaded.",
        SITE_VIST_NOT_NEEDED: "Site vist is not needed floor plan is in the job request.",
        ID_REQUIRED: "proposal Id required",
        CREATION_FAILED: "Proposal creation failed.",
        UPDATE_SUCCESS: "Proposal updation success.",
        UPDATE_FAILED: "Proposal updation failed.",
        UPDATE_NOT_REJECTED: "Only rejected  proposal can be updated.",
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
        NOT_ONGOING: "This proposal is not Active."
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
        ALREADY_SUCCESS: "Payment is already marked as success.",
        MARKED_SUCCESS: "Payment is marked as success.",
        INTENT_NOT_CREATED: 'Failed to create payment intent',
        INTENT_REQUIRED: 'Payment intent is required.',
        PAYOUT_NOT_FOUND: 'payout amount not found contact support',
        PAYOUT_DESIGNER_FAILED: 'Cannot pay designer contact support',
        PAYOUT_ADMIN_FAILED: 'Cannot pay admin contact support',
        STRIPE_META_DATA_NOT_FOUND: "Missing jobId or serviceOrder in payment metadata",
    },
    ESCROW: {
        NOT_FOUND: "Payment details not found"
    }

} as const