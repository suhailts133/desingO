import { useState } from "react"
import { useAuthService } from "../authService"
import type { VerifyOTPPayload } from "../authInterfaces";
import { useNavigate } from "react-router-dom";
import type { IApiResponse } from "../../../api/responseType";

export const useForgetPasswordOtpVerification = () => {
    const [forgetPasswordError, setforgetPasswordError] = useState<string | null>(null)
    const {forgetPasswordOTPVerification,isforgetPasswordOTPVerification} = useAuthService();
    const navigate = useNavigate();

    const  handleForgetpasswordOtpVerification = async (data:VerifyOTPPayload) => {
        setforgetPasswordError(null)
        const result:IApiResponse = await forgetPasswordOTPVerification(data);
        if(result.success){
            navigate("/auth/change-password", {state:{where:"forgetpasswordOtpVerification",email:data.email}})
        }else{
            setforgetPasswordError(result.message as string);
            setTimeout(() => {
                setforgetPasswordError(null)
            }, 3000);
        }
    }

    return {
        handleForgetpasswordOtpVerification,
        isLoadingForgetPassword:isforgetPasswordOTPVerification,
        forgetPasswordError
    }
}