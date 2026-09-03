export const ADMIN_MESSAGES = {

    ADMIN: {
        NOT_FOUND: "Admin not found"
    },
    USER_MANAGEMENT: {
        FETCH_ALL_SUCCESS: "Users retrieved successfully.",
        GET_ONE_SUCCESS: "User retrieved successfully.",
        USER_NOT_FOUND: "User not found.",
        TOGGLE_SUCCESS: "User status updated successfully.",
        TOGGLE_ERROR: "Failed to update user status. Please try again or contact support.",
        ID_NOT_PROVIDED: "user ID is required. "
    },

    DESIGNER_VERFICATION: {
        DESIGNER_APPLICATIONS: "Designer applications fetched successfully.",
        DESIGNER_APPLICATION_NOT_FOUND: "Designer application not found.",
        DESIGNER_APPLICATION_DETAIL: "Designer application detail fetched successfully.",
        STATUS_CHAGNE_NOT_FOUND: "Designer application not found or failed to process.",
        STATUS_CHANGE_USER_NOT_FOUND: "User not found for role update.",
        STATUS_CHANGE_FAIL: "Failed to assign designer role to user.",
        STATUS_CHANGE_SUCCESS: "Designer application approved successfully.",
        STATUS_CHANGE_REJECTED: "Designer application rejected successfully.",
        ID_NOT_PROVIDED: "application ID is required. "
    },

    TRANSACTION:{
        FETCH_ALL:"fetched all transactions",
        REPORT:"fetched transaction report",
        DATE_NOT_FOUND:"from and to is required for custom range",
        DATE_MISMATCH:"'from' date cannot be after 'to' date",
    }


} as const