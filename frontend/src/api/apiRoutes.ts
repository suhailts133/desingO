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

    },
    DESIGNS: {
        ADD_DESIGN: "/design/add-design",
        MY_DESIGNS: "/design/my-designs",
        DESIGN_DETAIL: "/design/designs",
        DESIGNS: "/design/designs",
        DESIGN_DELETE: "/design/designs",
    },
    CUSTOMER: {
        POST_JOB: "customer/post-job",
        MY_JOBS: "customer/my-jobs",
        JOB_DETAIL: "customer/jobs",
        JOBS: "/customer/jobs",
        JOB_DELETE: "/customer/jobs"

    },
} as const