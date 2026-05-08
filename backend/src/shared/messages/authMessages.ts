export const AUTH_MESSAGES = {
    AUTH: {
        UNAUTHORIZED: "Unauthorized access.",
        TOKEN_NOT_FOUND: "Token not found.",
        TOKEN_INVALID: "Invalid token or token is expired.",
        TOKEN_REVOKED: "Your token has been revoked.",
        EXPIRED: "Token expired. Please login again.",
        NOT_ADMIN: "You are not an Admin.",
        NOT_DESIGNER: "You are not a Designer.",
        NOT_CUSTOMER: "You are not a Customer.",

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
        LOGIN_FAILED: "Login failed.",
        GOOGLE_DATA_ACCESS_FAIL: "Failed to retrieve data from Google."
    },
    USER: {
        NOT_FOUND: "User does not exist. Please sign up."
    },
    EMAIL: {
        NOT_SEND: "Email failed to send, but the application was saved successfully."
    },

} as const