import { useNavigate } from "react-router-dom"
import { useDesignerVerificationService } from "../designerVerificationService"
import { useState } from "react"
import type { IApiResponse } from "../../../../api/responseType"

export const useDesignerVerification = () => {
    const { designerVerification, isLoading } = useDesignerVerificationService()
    const [designerError, setDesignerError] = useState<string | null>(null)
    const [designerSuccess, setDesignerSuccess] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleVerification = async (formData: FormData) => {
        setDesignerError("")
        setDesignerSuccess("")
        const result: IApiResponse = await designerVerification(formData);
        
        if (result.success) {
            setDesignerSuccess(result.message as string)
            setTimeout(() => {
                setDesignerSuccess("")
                navigate("/")
            }, 3000)
        }else{
            setDesignerError(result.message as string)
            setTimeout(() => {
                setDesignerError("")
            }, 3000);
        }
    }

    return {
        handleVerification,
        isLoading,
        designerError,
        designerSuccess
    }
}