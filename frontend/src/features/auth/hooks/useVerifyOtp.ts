import { useAuthService } from "../authService";
import type { VerifyOTPPayload } from "../authInterfaces";
import { useState } from "react";

export const useVerifyOtp = () => {
    const {verifyOtp,isVerifying} = useAuthService();
        const [error, setError] = useState<string>("");
    const handleVerification = async (data:VerifyOTPPayload) => {
        setError("");
        const result = await verifyOtp(data)
        if(!result.success){
            setError(result.message as string)
        }
        return result
    }

    return {
        handleVerification,
        error,
        isLoading:isVerifying
    }
}