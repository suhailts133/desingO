import { isApiError, UNKNOWN_ERROR } from "../../../helpers/errorhandler";
import { useDesignerVerificationMutation } from "./designerVerificationEndpoints"

export const  useDesignerVerificationService = () => {

    const [designerVerificationMutation, {isLoading}] = useDesignerVerificationMutation();

    const designerVerification = async (formData:FormData) => {
        try {
            const result = await designerVerificationMutation(formData).unwrap()
            return result
        } catch (error) {
             if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR
        }
    }


    return {
        designerVerification,
        isLoading
    }
}