import { useState } from "react";
import { useAuthService } from "../authService"
import type { LoginPayload } from "../authInterfaces";
import type { IApiResponse } from "../../../api/responseType";
import { useNavigate } from "react-router-dom";
import type { JwtResponse } from "../../../api/apiInterface";

export const useLogin = () => {
    const {login,isLogging} = useAuthService();
    const [loginError, setLoginError] = useState<string | null>(null)
    const navigate = useNavigate();
    const handleLogin = async (data:LoginPayload) =>{
        setLoginError(null)
        const result:IApiResponse<JwtResponse> = await login(data)
        if(result.success){
            navigate("/"); 
        }else{
            setLoginError(result.message as string)
             setTimeout(() => {
                setLoginError(null);
            }, 3000);
        }

    }
    return {
        handleLogin,
        isLoading:isLogging,
        loginError
    }
}