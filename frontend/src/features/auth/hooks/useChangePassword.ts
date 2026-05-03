import { useState } from "react"
import { useAuthService } from "../authService"
import type { changePasswordPayload } from "../authInterfaces"
import { useNavigate } from "react-router-dom"

export const useChangePassword = () => {
    const {changePassword, isChangePassword} = useAuthService()
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate();
    const handleChangePassword = async(payload:changePasswordPayload) => {
        setError(null)
        const result = await changePassword(payload)
        if(result.success){
            navigate("/auth/login")
        }else{
            setError(result.message as string)
            setTimeout(() => {
                setError(null)
            }, 300);
        }
    }

    return {
        isLoading:isChangePassword,
        error,
        handleChangePassword
    }
}