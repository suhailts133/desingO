import { isApiError, UNKNOWN_ERROR } from "../../../helpers/errorhandler"
import { useDeleteMyJobApplicationMutation } from "./myJobApplicationEndpoints"

export const useMyJobApplicationServices = () => {
    const [deleteMyJobApplicationMutation, { isLoading: isDeleting }] = useDeleteMyJobApplicationMutation()

    const deleteMyJobApplication = async (id: string) => {
        try {
            const result = await deleteMyJobApplicationMutation(id).unwrap()
            return result
        } catch (error) {
            if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR
        }
    }

    return {
        isDeleting,
        deleteMyJobApplication
    }
}