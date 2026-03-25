import { baseApi } from "../../api/baseApi";
import type { changePasswordPayload, EmailPayload, GoogleLoginPayload, LoginPayload, ResendOtpPayload, SignUpPayload, VerifyOTPPayload } from "./authInterfaces";
import type { IApiResponse } from "../../api/responseType";
import { API_ROUTES } from "../../api/apiRoutes";
import type { JwtResponse } from "../../api/apiInterface";


export const authApi = baseApi.injectEndpoints({
    endpoints:(builder) => ({
        signUp:builder.mutation<IApiResponse,SignUpPayload>({
            query:(body) => ({
                url: API_ROUTES.AUTH.SIGN_UP,
                method:"POST",
                body
            })
        }),

        verifyOtp:builder.mutation<IApiResponse<JwtResponse>,VerifyOTPPayload>({
            query:(body) => ({
                url:API_ROUTES.AUTH.VERIFY_OTP,
                method:"POST",
                body
            })
        }),
        resendOtp:builder.mutation<IApiResponse, ResendOtpPayload>({
            query: (body) => ({
                url:API_ROUTES.AUTH.RESEND_OTP,
                method:"POST",
                body
            })
        }),
        login:builder.mutation<IApiResponse<JwtResponse>, LoginPayload>({
            query:(body) => ({
                url:API_ROUTES.AUTH.LOGIN,
                method:"POST",
                body
            })
        }),
        forgetpassword:builder.mutation<IApiResponse, EmailPayload>({
            query:(body) => ({
                url:API_ROUTES.AUTH.FORGETPASSWORD,
                method:"POST",
                body
            })
        }),
        forgetPasswordOTPVerification:builder.mutation<IApiResponse, VerifyOTPPayload>({
            query:(body) => ({
                url:API_ROUTES.AUTH.FORGETPASSWORD_VERIFY_OTP,
                method:"POST",
                body,
            })
        }),
        forgetPasswordResendOTP:builder.mutation<IApiResponse, ResendOtpPayload>({
            query:(body) => ({
                url:API_ROUTES.AUTH.FORGETPASSWORD_RESEND_OTP,
                method:"POST",
                body,
            })
        }),
        forgetPasswordChangePassword:builder.mutation<IApiResponse, changePasswordPayload>({
            query:(body) => ({
                url:API_ROUTES.AUTH.FORGETPASSWORD_CHANGE_PASSWORD,
                method:"POST",
                body,
            })
        }),
        adminLogin:builder.mutation<IApiResponse, LoginPayload>({
            query:(body) => ({
                url:API_ROUTES.AUTH.ADMIN_LOGIN,
                method:"POST",
                body,
            })
        }),
        googleLogin:builder.mutation<IApiResponse<JwtResponse>, GoogleLoginPayload>({
            query:(body) => ({
                url:API_ROUTES.AUTH.GOOGLE_LOGIN,
                method:"POST",
                body,
            })
        }),
    })
})


export const {
    useSignUpMutation,
    useVerifyOtpMutation,
    useResendOtpMutation,
    useLoginMutation,
    useForgetpasswordMutation,
    useForgetPasswordOTPVerificationMutation,
    useForgetPasswordResendOTPMutation,
    useForgetPasswordChangePasswordMutation,
    useAdminLoginMutation,
    useGoogleLoginMutation
} = authApi