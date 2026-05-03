import { isApiError, UNKNOWN_ERROR } from "../../../helpers/errorhandler";
import { useAddDesignMutation, useDeleteADesignMutation, useEditDesignMutation } from "./designEndpoints"

export const useDesignServices = () => {

    const [addDesignMutation, { isLoading }] = useAddDesignMutation();
    const [deleteDesignMutation, { isLoading: isDeleting }] = useDeleteADesignMutation();
    const [editDesignMutation, { isLoading: isEditing }] = useEditDesignMutation();

    const editDesign = async ({ formdata, id }: { formdata: FormData; id: string }) => {
        try {
            const result = await editDesignMutation({ formdata, id }).unwrap()

            return result
        } catch (error) {
             if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR
        }
    }
    const addDesign = async (formData: FormData) => {
        try {
            const result = await addDesignMutation(formData).unwrap()
            console.log(result)
            return result
        } catch (error) {
             if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR
        }
    }
    const deleteADesign = async (id: string) => {
        try {
            const result = await deleteDesignMutation(id).unwrap()
            return result
        } catch (error) {
            if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR
        }
    }

    return {
        addDesign,
        isLoading,
        deleteADesign,
        isDeleting,
        isEditing,
        editDesign
    }
}