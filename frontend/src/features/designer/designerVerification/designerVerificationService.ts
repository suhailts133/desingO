import { useDesignerVerificationMutation } from "./designerVerificationEndpoints"

export const  useDesignerVerificationService = () => {

    const [designerVerificationMutation, {isLoading}] = useDesignerVerificationMutation();

    const designerVerification = async (formData:FormData) => {
        try {
            const result = await designerVerificationMutation(formData).unwrap()
            console.log(result)
            return result
        } catch (error:any) {
            return error.data
        }
    }


    return {
        designerVerification,
        isLoading
    }
}