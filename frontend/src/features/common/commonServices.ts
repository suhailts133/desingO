import { isApiError, UNKNOWN_ERROR } from "../../helpers/errorhandler"
import { useSaveDesignMutation } from "./commonEndpoints"
import type { ISavedDesignDTO } from "./commonInterface"

export const useCommonServices = () => {
    const [saveDesignMutation, {isLoading}] = useSaveDesignMutation()

    const saveDesign = async (payload:ISavedDesignDTO) => {
        try {
            const result = await saveDesignMutation(payload).unwrap()
            return result
        } catch (error) {
            if(isApiError(error)){
                return error.data
            }
            return UNKNOWN_ERROR
        }
    }

    return {
        isLoading,
        saveDesign
    }
}