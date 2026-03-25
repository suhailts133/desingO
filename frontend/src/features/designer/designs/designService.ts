import { useAddDesignMutation,  useDeleteADesignMutation } from "./designEndpoints"

export const useDesignServices = () => {

    const [addDesignMutation, { isLoading }] = useAddDesignMutation();
    const [deleteDesignMutation, { isLoading:isDeleting }] = useDeleteADesignMutation();

    const addDesign = async (formData: FormData) => {
        try {
            const result = await addDesignMutation(formData).unwrap()
            console.log(result)
            return result
        } catch (error: any) {
            return error.data
        }
    }
    const deleteADesign = async (id: string) => {
        try {
            const result = await deleteDesignMutation(id).unwrap()
            return result
        } catch (error: any) {
            return error.data
        }
    }

    return {
        addDesign,
        isLoading,
        deleteADesign,
        isDeleting
    }
}