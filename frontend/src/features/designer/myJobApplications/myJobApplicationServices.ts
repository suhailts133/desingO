import { useDeleteMyJobApplicationMutation } from "./myJobApplicationEndpoints"

export const useMyJobApplicationServices = () => {
    const [deleteMyJobApplicationMutation, { isLoading: isDeleting }] = useDeleteMyJobApplicationMutation()

    const deleteMyJobApplication = async (id: string) => {
        try {
            const result = await deleteMyJobApplicationMutation(id).unwrap()
            return result
        } catch (error: any) {
            return error.data
        }
    }

    return {
        isDeleting,
        deleteMyJobApplication
    }
}