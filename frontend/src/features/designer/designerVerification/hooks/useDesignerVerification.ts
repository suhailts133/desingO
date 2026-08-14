import { useDesignerVerificationService } from "../designerVerificationService"

export const useDesignerVerification = () => {
    const { designerVerification, isLoading } = useDesignerVerificationService()

    const handleVerification = async (formData: FormData) => await designerVerification(formData);

    return {
        handleVerification,
        isLoading,
        
    }
}