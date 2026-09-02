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
    RECOMENDATION:{
        DESIGN:"/recomendation/designs",
        JOBS:"/recomendation/jobs",
    },
    ADMIN: {
        GET_ALL_USERS: "/admin/users",
        GET_ALL_USER: "/admin/users",
        GET_ALL_DISPUTES: "/admin/disputes",
        GET_ALL_TRANSACTION: "/admin/transaction",
        GET_DISPUTE: "/admin/disputes",
        GIVE_VERDIT: "/admin/disputes/give-verdit",
        TOGGLE_USER_STATUS: '/admin/users/toggle-status',
        GET_ALL_DESIGNER_REQUESTS: "/admin/designer-application",
        GET_DESIGNER_REQUEST: "/admin/designer-application",
        CHANGE_DESISNER_VERIFICATION_STATUS: "/admin/designer-application/status"
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
        DESIGN_GALLARY: "/design/gallary"
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
        JOB_APPLICATIONS: "/job-application",
        DETAIL: "/job-application",
        UPDATE_STATUS: "/job-application/approve-reject",
        DELETE: "/job-application",
    },
    PROIFILE: {
        GET_DESIGNER_PROFILE: "/profile/designer",
        UPDATE_DESIGNER_DATA: "/profile/designer",
        GET_CUSTOMER_PROFILE: "/profile/user",
        UPDATE_CUSTOMER_DATA: "/profile/user",
        CHANGE_PROFILE_IMAGE: "/profile/change-profile-image",
    },
    HIRE_DESIGNER: {
        CREATE: "/direct-hire/create",
        MY_REQUESTS: "/direct-hire/my",
        REQUEST_PER_DESIGN: "/job/design/request",
        ACCEPT_OR_REJECT: "/job/accept-reject",
        DELETE: "/direct-hire/request",
    },

    SAVE_DESIGNS: {
        ADD_REMOVE: "/saved-design/add-or-remove",
        MY_DESIGNS: "/saved-design/my"
    },
    ACTIVE_JOB: {
        CUSTOMER: "/active-job/customer",
        DESIGNER: "/active-job/designer"
    },
    DASHBOARD: {
        DESIGNER: "/dashboard/designer",
        CUSTOMER: "/dashboard/customer",
        ADMIN: "/dashboard/admin"
    },
    PROPOSAL: {
        UPLOAD_FLOOR_PLAN: "/proposal/upload-floor-plan",
        CREATE: "/proposal/create",
        UPDATE: "/proposal/update",
        MY_PROPOSAL: "/proposal",
        PREFILL_DATA: "/proposal/prefill",
        APPROVE_REJECT: "/proposal/approve-reject",
        UPLOAD_RESULT: "/proposal/upload-result",
        APPROVE_REJECT_VERSION: "/proposal/approve-reject-version",
    },
    REVIEW: {
        CREATE: "/review/create",
        MY_REVIEWS: "/review/my"
    },
    PAYMENT: {
        INTENT: "/payments/intent",
        VERIFY: "/payments/verify"
    },
    DISPUTE: {
        REPORT: "/dispute/report-issue",
        GET_DISPUTE: "/dispute",
        GET_ALL_DISPUTE: "/dispute",
        ACCEPT_OR_REJECT: "/dispute/accept-reject",
    }
} as const