import { useDispatch } from "react-redux";
import { useAdminLoginMutation, useForgetPasswordChangePasswordMutation, useForgetpasswordMutation, useForgetPasswordOTPVerificationMutation, useForgetPasswordResendOTPMutation, useGoogleLoginMutation, useLoginMutation, useResendOtpMutation, useSignUpMutation, useVerifyOtpMutation } from "./authEndpoints";
import type { AppDispatch } from "../../app/store";
import type { changePasswordPayload, EmailPayload, GoogleLoginPayload, LoginPayload, ResendOtpPayload, SignUpPayload, VerifyOTPPayload } from "./authInterfaces";
import { setCredentials } from "../../app/authSlice";
import { isApiError, UNKNOWN_ERROR } from "../../helpers/errorhandler";



export const useAuthService = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [signUpMutation, { isLoading: isSigningUp }] = useSignUpMutation();
    const [verifyOtpMutaion, { isLoading: isVerifying }] = useVerifyOtpMutation();
    const [resendOtpMutaion, { isLoading: isSending }] = useResendOtpMutation();
    const [loginMutation, { isLoading: isLogging }] = useLoginMutation();
    const [forgetPasswordMutation, { isLoading: isforgetPassword }] = useForgetpasswordMutation();
    const [forgetPasswordOTPVerificationMutation, { isLoading: isforgetPasswordOTPVerification }] = useForgetPasswordOTPVerificationMutation();
    const [forgetPasswordResendOTPMutation, { isLoading: isForgetPasswordResend }] = useForgetPasswordResendOTPMutation();
    const [forgetPasswordChangePasswordMutation, { isLoading: isChangePassword }] = useForgetPasswordChangePasswordMutation();
    const [adminLoginMutation, { isLoading: isAdminLogging }] = useAdminLoginMutation()
    const [googleLoginMutation, { isLoading: isGoogle }] = useGoogleLoginMutation()


    const signUp = async (payload: SignUpPayload) => {
        try {
            const result = await signUpMutation(payload).unwrap();
            return result
        } catch (error) {
            if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR
        }
    }

    const verifyOtp = async (payload: VerifyOTPPayload) => {
        try {
            const result = await verifyOtpMutaion(payload).unwrap();
            if (!result.data) {
                return { success: false, message: "JWT token not found" }
            }
            dispatch(setCredentials(result.data))
            return result
        } catch (error) {
            if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR
        }
    }

    const resendOtp = async (payload: ResendOtpPayload) => {
        try {
            const result = await resendOtpMutaion(payload).unwrap();
            return result
        } catch (error) {
            if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR
        }
    }

    const login = async (payload: LoginPayload) => {
        try {
            const result = await loginMutation(payload).unwrap()
            if (!result.data) {
                return { success: false, message: "JWT token not found" }
            }

            dispatch(setCredentials(result.data))
            return result
        } catch (error) {
            if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR
        }
    }


    const forgetPassword = async (payload: EmailPayload) => {
        try {
            const result = await forgetPasswordMutation(payload).unwrap()
            return result
        } catch (error) {
            if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR
        }
    }


    const forgetPasswordOTPVerification = async (payload: VerifyOTPPayload) => {
        try {
            const result = await forgetPasswordOTPVerificationMutation(payload).unwrap();
            return result
        } catch (error) {
            if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR
        }
    }
    const forgetPasswordResendOtp = async (payload: ResendOtpPayload) => {
        try {
            const result = await forgetPasswordResendOTPMutation(payload).unwrap();
            return result
        } catch (error) {
            if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR
        }
    }

    const changePassword = async (payload: changePasswordPayload) => {
        try {
            const result = await forgetPasswordChangePasswordMutation(payload).unwrap();
            return result
        } catch (error) {
            if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR
        }
    }

    const adminLogin = async (payload: LoginPayload) => {
        try {
            const result = await adminLoginMutation(payload).unwrap()
            if (!result.data) {
                return { success: false, message: "JWT token not found" }
            }
            dispatch(setCredentials(result.data))
            return result
        } catch (error) {
            if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR
        }
    }


    const googleLogin = async (payload: GoogleLoginPayload) => {
        try {
            const result = await googleLoginMutation(payload).unwrap()
            console.log("data from the backend: ", result)
            if (!result.data) {
                return { success: false, message: "JWT token not found" }
            }
            dispatch(setCredentials(result.data))
            return result
        } catch (error) {
            if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR

        }
    }


    return {
        signUp,
        isSigningUp,
        verifyOtp,
        isVerifying,
        resendOtp,
        isSending,
        login,
        isLogging,
        forgetPassword,
        isforgetPassword,
        forgetPasswordOTPVerification,
        isforgetPasswordOTPVerification,
        forgetPasswordResendOtp,
        isForgetPasswordResend,
        changePassword,
        isChangePassword,
        adminLogin,
        isAdminLogging,
        googleLogin,
        isGoogle
    }
}

