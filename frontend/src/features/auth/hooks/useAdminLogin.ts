import { useState } from "react";
import { useAuthService } from "../authService"
import type { LoginPayload } from "../authInterfaces";
import type { IApiResponse } from "../../../api/responseType";
import { useNavigate } from "react-router-dom";

export const useAdminLogin = () => {
    const {adminLogin,isAdminLogging} = useAuthService();
    const [loginError, setLoginError] = useState<string | null>(null)
    const navigate = useNavigate();
    const handleAdminLogin = async (data:LoginPayload) =>{
        setLoginError(null)
        const result:IApiResponse = await adminLogin(data)
        if(result.success){
            navigate("/admin/dashboard"); 
        }else{
            setLoginError(result.message as string)
             setTimeout(() => {
                setLoginError(null);
            }, 3000);
        }

    }
    return {
        handleAdminLogin,
        isLoading:isAdminLogging,
        loginError
    }
}