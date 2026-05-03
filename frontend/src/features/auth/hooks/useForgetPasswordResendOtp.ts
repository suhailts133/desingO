import { useState } from "react"
import { useAuthService } from "../authService"
import type { ResendOtpPayload } from "../authInterfaces";

export const useForgetPasswordResendOtp = () => {
    const [forgetPasswordResendError, setforgetPasswordResendError] = useState<string | null>(null)
    const [forgetPasswordResendOtpSuccessMessage, setForgetPasswordResendOtpSuccessMessage] = useState<string | null>(null);
    const { forgetPasswordResendOtp, isForgetPasswordResend } = useAuthService();


    const handleForgetpasswordResendOtp = async (data: ResendOtpPayload) => {
        setforgetPasswordResendError(null)
        setForgetPasswordResendOtpSuccessMessage(null)
        const result = await forgetPasswordResendOtp(data);
        if (result.success) {
            setForgetPasswordResendOtpSuccessMessage(result.message as string)
            setTimeout(() => {
                setForgetPasswordResendOtpSuccessMessage(null)
            }, 3000);
        } else {
            setforgetPasswordResendError(result.message as string);
            setTimeout(() => {
                setforgetPasswordResendError(null)
            }, 3000);

        }
    }

    return {
        handleForgetpasswordResendOtp,
        isLoadingForgetPasswordResend: isForgetPasswordResend,
        forgetPasswordResendError,
        forgetPasswordResendOtpSuccessMessage
    }
}