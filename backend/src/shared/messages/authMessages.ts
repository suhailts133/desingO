export const AUTH_MESSAGES = {
    AUTH: {
        UNAUTHORIZED: "Unauthorized access.",
        TOKEN_NOT_FOUND: "Token not found.",
        EXPIRED: "Token expired. Please login again"
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