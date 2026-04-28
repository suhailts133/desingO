export const API_ROUTES = {
    AUTH: {
        SIGN_UP: "/auth/signup",
        VERIFY_OTP: "/auth/verify-otp",
        RESEND_OTP: "/auth/resend-otp",
        LOGIN: "/auth/login",
        FORGETPASSWORD: "/auth/forgetPassword",
        FORGETPASSWORD_VERIFY_OTP: "/auth/forgetPassword-verify-otp",
        FORGETPASSWORD_RESEND_OTP: "/auth/forgetPassword-resend-otp",
        FORGETPASSWORD_CHANGE_PASSWORD: "/auth/forgetPassword-change-password",
        ADMIN_LOGIN: "/auth/admin-login",
        GOOGLE_LOGIN: "/auth/google",
        REFRESH_TOKEN: "/auth/refresh"
    },
    ADMIN: {
        GET_ALL_USERS: "/admin/users",
        GET_ALL_USER: "/admin/users",
        TOGGLE_USER_STATUS: '/admin/users/toggle-status',
        GET_ALL_DESIGNER_REQUESTS: "/admin/designer-requests",
        GET_DESIGNER_REQUEST: "/admin/designer-requests",
        CHANGE_DESISNER_VERIFICATION_STATUS: "/admin/designer-requests/status"
    },
    DESIGNER: {
        DESIGNER_VERIFICATION: "/designer/designer-verification",
        GET_ALL_DESIGNERS: "/designer",
        GET_DESIGNER_DETAIL: (id: string) => `/designer/${id}`

    },
    DESIGNS: {
        ADD_DESIGN: "/design/add-design",
        EDIT_DESIGN: "/design/edit-design",
        MY_DESIGNS: "/design/my",
        DESIGN_DETAIL: "/design",
        DESIGNS: "/design/all-designs",
        DESIGN_DELETE: "/design",
        DESIGN_GALLARY:"/design/gallary"
    },
    JOB: {
        POST_JOB: "/job/post-job",
        EDIT_JOB: "/job/edit-job",
        MY_JOBS: "/job/my",
        JOB_DETAIL: "/job",
        JOBS: "/job",
        JOB_DELETE: "/job"
    },
    JOB_APPLICATION: {
        APPLY: "/job-application/apply",
        MY_APPLICATIONS: "/job-application/my",
        ALL_APPLICATIONS: "/job-application",
        DETAIL: "/job-application",
        UPDATE_STATUS: "/job-application/approve-reject",
        DELETE: "/job-application",
    },
    PROIFILE: {
        GET_DESIGNER_PROFILE: "/profile/designer",
        CHANGE_PROFILE_IMAGE: "/profile/change-profile-image",
        UPDATE_DESIGNER_DATA: "/profile/designer"
    }
} as const