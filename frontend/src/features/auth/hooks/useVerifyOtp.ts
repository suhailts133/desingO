import { useNavigate } from "react-router-dom"
import { useAuthService } from "../authService";
import type { VerifyOTPPayload } from "../authInterfaces";
import { useState } from "react";

export const useVerifyOtp = () => {
    const navigate = useNavigate();
    const {verifyOtp,isVerifying} = useAuthService();
        const [error, setError] = useState<string>("");

    const handleVerification = async (data:VerifyOTPPayload) => {
        setError("");
        const result = await verifyOtp(data)
        if(result.success){
            navigate("/", {state:{where:"signUpOtpVerification"}})
        }else{
            setError(result.message as string)
        }
    }

    return {
        handleVerification,
        error,
        isLoading:isVerifying
    }
}