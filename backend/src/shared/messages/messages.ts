export const MESSAGES = {


    JOB_APPLICATION: {
        ALREADY_APPLIED: "You have already applied for this job.",
        APPLIED_SUCCESS: "Job application submitted successfully.",
        NOT_FOUND: "Job application not found.",
        DELETED_SUCCESS: "Job application deleted successfully.",
        STATUS_UPDATED_SUCCESS: "Job application status updated successfully.",
        ALL_JOB_APPLICATIONS: "Fetched all job applications successfully.",
        MY_JOB_APPLICATIONS: "Fetched my job applications successfully.",
        CHECK_JOB_APPLICATION_ID: "Job application ID is required."
    },

    JOB_REQUEST: {
        ID_REQUIRED: "Job request id is required.",
        NOT_FOUND: "Job request not found.",
        JOB_REQUEST_FAIL: "Failed to post job request, please try again.",
        JOB_REQUEST_SUCCESS: "Job request posted successfully.",
        UPDATION_FAILED: "Failed to update your job request. Please contact support.",
        UPDATION_SUCCESS: "Job request updated successfully.",
        MY_JOB_REQUEST: "Fetched my job requests successfully.",
        ALL_JOB_REQUEST: "Fetched  job requests successfully.",
        JOB_REQUEST: "Fetched  job request successfully.",
        DELETION_FAILED: "Failed to delete your job request. Please contact support.",
        DELETION_SUCCESS: "Job request deleted successfully.",
    },

    AUTH: {
        UNAUTHORIZED: "Unauthorized access.",
        TOKEN_NOT_FOUND: "Token not found.",
        EXPIRED: "Token expired. Please login again"
    },

    PROFILE: {
        IMAGE_NOT_FOUND: "Image not found.",
        IMAGE_UPLOAD_RESULT: "Image changed successfully.",
        USER_NOT_FOUND: "User not found.",
        USER_FOUND: "User fetched successfully.",
        UPDATE_SUCCESS: "Profile updated successfully.",
        UPDATE_FAIL: "Profile update failed."
    },

    DESIGNER: {
        GET_ALL_DESIGNERS: "Designers fetched successfully.",
        DESIGNER_NOT_FOUND: "Designer not found.",
        DESIGNER_FOUND: "Designer data fetched successfully.",
        ID_REQUIRED: "Designer ID is required.",
    },

    ADMIN_USER_MANAGEMENT: {
        FETCH_ALL_SUCCESS: "Users retrieved successfully.",
        GET_ONE_SUCCESS: "User retrieved successfully.",
        USER_NOT_FOUND: "User not found.",
        TOGGLE_SUCCESS: "User status updated successfully.",
        TOGGLE_ERROR: "Failed to update user status. Please try again or contact support."
    },

    ADMIN_DESIGNER_VERFICATION: {
        DESIGNER_APPLICATIONS: "Designer applications fetched successfully.",
        DESIGNER_APPLICATION_NOT_FOUND: "Designer application not found.",
        DESIGNER_APPLICATION_DETAIL: "Designer application detail fetched successfully.",
        STATUS_CHAGNE_NOT_FOUND: "Designer application not found or failed to process.",
        STATUS_CHANGE_USER_NOT_FOUND: "User not found for role update.",
        STATUS_CHANGE_FAIL: "Failed to assign designer role to user.",
        STATUS_CHANGE_SUCCESS: "Designer application approved successfully.",
        STATUS_CHANGE_REJECTED: "Designer application rejected successfully.",
    },

    DESIGNER_VERIFICATION: {
        PROOF_NOT_fOUND: "Proof image is required for each work experience entry.",
        GOVT_IMAGE_NOT_FOUND: "Government ID image is required.",
        CERTIFICATE_NOT_FOUND: "Certificate image is required for each education entry.",
        SUCCESS: "Form submitted successfully. Please check your email for confirmation.",
        ALREADY_A_DESIGNER: "You are already a designer.",
        ALREADY_APPLIED: "You have already applied for the designer position. Please check your email."
    },

    DESIGNS: {
        ID_REQUIRED: "Design ID is required.",
        DESIGN_NOT_FOUND: "Design not found. Please contact support.",
        GET_ALL_DESIGNS: "Designs fetched successfully.",
        DESIGN_CREATE_FAIL: "Failed to post your design. Please contact support.",
        DESIGN_CREATE_SUCCESS: "Design posted successfully.",
        COVER_IMAGE_NOT_FOUND: "Cover image is required.",
        GALLERY_NOT_FOUND: "Gallery is required.",
        UPDATION_FAILED: "Failed to update your design. Please contact support.",
        UPDATION_SUCCESS: "Design updated successfully.",
        DELETION_FAILED: "Failed to delete your design. Please contact support.",
        DELETION_SUCCESS: "Design deleted successfully.",
    },

    USER: {
        NOT_FOUND: "User does not exist. Please sign up."
    },

    EMAIL: {
        NOT_SEND: "Email failed to send, but the application was saved successfully."
    },

    LOGIN_SIGNUP: {
        EXPIRED_TOKEN: "Token expired. Please log in again.",
        NEW_TOKEN_CREATED: "New access token created.",
        EMAIL_ALREADY_EXISTS: "Email already exists.",
        EMAIL_NOT_FOUND: "Email not found.",
        OTP_SENT_FAIL: "Failed to send OTP.",
        OTP_SENT_SUCCESS: "OTP has been sent to your email.",
        OTP_SUCCESS: "OTP verification successful.",
        OTP_INCORRECT: "Incorrect OTP.",
        OTP_EXPIRED: "OTP expired. Please try again.",
        PASSWORD_CHANGE_FAIL: "Unable to change password.",
        PASSWORD_CHANGE_SUCCESS: "Password changed successfully. Please log in again.",
        USER_BLOCKED: "Your account has been blocked. Contact support.",
        GOOGLE_LOGIN_DETECTED: "Did you log in with Google?",
        INVALID_CREDENTIALS: "Invalid credentials.",
        NOT_ADMIN: "You are not an admin.",
        LOGIN_SUCCESS: "Login successful.",
        GOOGLE_DATA_ACCESS_FAIL: "Failed to retrieve data from Google."
    }
} as const