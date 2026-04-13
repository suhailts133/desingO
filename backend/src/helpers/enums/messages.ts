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
        NOT_FOUND: "Job request not found.",
    },

    AUTH: {
        UNAUTHORIZED: "Unauthorized access."
    },

    PROFILE: {
        IMAGE_NOT_FOUND: "Image not found.",
        IMAGE_UPLOAD_RESULT: "Image changed successfully.",
        USER_NOT_FOUND: "User not found.",
        USER_FOUND: "User fetched successfully.",
        UPDATE_SUCCESS: "Profile Updation Successfull.",
        UPDATE_FAIL: "Profile Updation failted."
        
    },


} as const  