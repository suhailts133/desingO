import { useState } from "react"
import { useAuthService } from "../authService"
import type { EmailPayload } from "../authInterfaces";
import type { IApiResponse } from "../../../api/responseType";
import { useNavigate } from "react-router-dom";

export const useForgetPassword = () => {
    const [error, setError] = useState<string | null>(null)
    const {forgetPassword,isforgetPassword} = useAuthService();
    const navigate = useNavigate();
    const handleForgetPassword = async (data:EmailPayload) => {
        setError(null)
        const result:IApiResponse = await forgetPassword(data);
        if(result.success){
            navigate("/auth/verify-otp", {state:{where:"forgetPassword", email:data.email}})
        }else{
            setError(result.message as string)
            setTimeout(() => {
                setError(null)
            }, 3000);
        }
    }

    return {
        isLoading:isforgetPassword,
        error,
        handleForgetPassword
    }
}