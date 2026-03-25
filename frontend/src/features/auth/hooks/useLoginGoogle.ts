import { useState } from "react"
import type { GoogleLoginPayload } from "../authInterfaces"
import { useAuthService } from "../authService"
import type { IApiResponse } from "../../../api/responseType"
import type { JwtResponse } from "../../../api/apiInterface"
import { useNavigate } from "react-router-dom"

export const useLoginGoogle = () => {
    const [googleError, setGoogleError] = useState<string | null>(null)
    const { googleLogin, isGoogle } = useAuthService()
    const navigate = useNavigate();
    const handleGoogleLogin = async (payload: GoogleLoginPayload) => {
        setGoogleError(null)
        const result: IApiResponse<JwtResponse> = await googleLogin(payload);
        
        if (result.success) {
            navigate("/");
        } else {
            setGoogleError(result.message as string)
            setTimeout(() => {
                setGoogleError(null)
            }, 3000);
        }
    }


    return {
        handleGoogleLogin,
        isGoogle,
        googleError
    }
}