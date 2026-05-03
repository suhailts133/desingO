import {useState} from "react";
import { useNavigate } from "react-router-dom";
import { useAuthService } from "../authService";
import type { SignUpPayload } from "../authInterfaces";

export const useSignUp = () => {
    const navigate = useNavigate();
    const {signUp,isSigningUp} = useAuthService();
    const [error, setError] = useState<string | null>(null);

    const handleSignUp = async (data:SignUpPayload) => {
        setError(null)
        const result = await signUp(data);
        if(result.success){
            navigate("/auth/verify-otp",{ state:{where:"signup", email:data.email}})
        }else{
            setError(result.message as string)
            setTimeout(() => {
                setError(null)
            }, 3000);
        }
    }
    return {
        handleSignUp,
        isLoading:isSigningUp,
        error
    }
}