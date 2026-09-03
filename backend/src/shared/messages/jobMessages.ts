export const JOB_MESSAGES = {

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
        RECOMENDED: "fetched recomended jobs.",
        RECENT: "fetched recent jobs.",
        SOURCE_INVALID: "Invalid source type",
        ID_REQUIRED: "Job request id is required.",
        NOT_FOUND: "Job request not found.",
        ACCEPTED_CANT_UPDATE: "The job request is accepted so cant update.",
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

    HIRE_DESIGNER: {
        ID_REQUIRED: "Hire id is required.",
        CREATED: "Your request has been submitted.",
        NOT_FOUND: "hire request not found.",
        DELETE: "request deleted successfully.",
        DELETE_FAIL: "request deleted failed.",
        DELETE_STATUS_NOT_PENDING: "you can only delete if the status is pending.",
        UPDATE_SUCCESS: "Update successfull.",
        UPDATE_FAIL: "update failed.",
        ALREADY_STATUS_CHANGED: "request status is already changed.",
        FAIL: "you have already submitted a request.",
        MY_REQUEST: "successfully fetched all you hire designer request.",
        EXTRA_SERVICES: "You have selected some extra services that the designer is not providing.",
        AREA_MISMATCH: "Your room dimensions differ significantly from the original design",
        DESIGNER_BUSY: "This designer currently has more than 2 active jobs"

    },
    ACTIVE_JOB: {
        NOT_FOUND: "Active job not found.",
        UPDATION_FAILED: "failed to update active job.",
        FETCH_ALL: "Fetched all active jobs."
    }

} as const