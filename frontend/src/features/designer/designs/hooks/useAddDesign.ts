import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useDesignServices } from "../designService"
export const useAddDesign = () => {
    const { addDesign, isLoading } = useDesignServices()
    const [designError, setDesignError] = useState<string | null>(null)
    const [designSuccess, setDesignSuccess] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleSubmission = async (formData: FormData) => {
        setDesignError(null)
        setDesignSuccess(null)
        const result = await addDesign(formData);
        
        if (result.success) {
            setDesignSuccess(result.message as string)
            setTimeout(() => {
                setDesignSuccess(null)
                navigate("/designer/designs")
            }, 2000)
        }else{
            setDesignError(result.message as string)
            setTimeout(() => {
                setDesignError("")
            }, 3000);
        }
    }

    return {
        handleSubmission,
        isLoading,
        designError,
        designSuccess
    }
}