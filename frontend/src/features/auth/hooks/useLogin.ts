import { useState } from "react";
import { useAuthService } from "../authService"
import type { LoginPayload } from "../authInterfaces";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
    const {login,isLogging} = useAuthService();
    const [loginError, setLoginError] = useState<string | null>(null)
    const navigate = useNavigate();
    const handleLogin = async (data:LoginPayload) =>{
        setLoginError(null)
        const result = await login(data)
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