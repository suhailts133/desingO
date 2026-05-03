import { useState } from "react";
import { useAuthService } from "../authService"
import type { ResendOtpPayload } from "../authInterfaces";

export const useResendOtp = () => {
    const { resendOtp, isSending } = useAuthService();
    const [resendOTPError, setResendOTPError] = useState<string | null>(null);
    const [resendOtpSuccessMessage, setResendOtpSuccessMessage] = useState<string | null>(null);

    const handleResendOtp = async (data: ResendOtpPayload) => {
        setResendOTPError("")
        setResendOtpSuccessMessage("")
        const result = await resendOtp(data);
        if (result.success) {
            setResendOtpSuccessMessage(result.message as string)
            setTimeout(() => {
                setResendOtpSuccessMessage(null);
            }, 3000);
        } else {
            setResendOTPError(result.message as string)
            setTimeout(() => {
                setResendOTPError(null);
            }, 3000);
        }
    }

    return {
        handleResendOtp,
        isResendOtpLoading: isSending,
        resendOTPError,
        resendOtpSuccessMessage
    }

}