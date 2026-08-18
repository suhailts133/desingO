import { isApiError, UNKNOWN_ERROR } from "../../../helpers/errorhandler";
import type { HireDesignerFields } from "../../user/jobs/jobInterface";
import { useAddDesignMutation, useApproveOrRejectHireRequestMutation, useDeleteADesignMutation, useEditDesignMutation, useHireDesignerMutation } from "./designEndpoints"
import type { AcceptOrRejectHireDesigner } from "./designInterface";

export const useDesignServices = () => {

    const [addDesignMutation, { isLoading }] = useAddDesignMutation();
    const [deleteDesignMutation, { isLoading: isDeleting }] = useDeleteADesignMutation();
    const [editDesignMutation, { isLoading: isEditing }] = useEditDesignMutation();
    const [hireDesingerMutatin, { isLoading: isHiring }] = useHireDesignerMutation()
    const [approveOrRejectHireRequestMutation, { isLoading: isApproveOrReject }] = useApproveOrRejectHireRequestMutation()

    const hireDesigner = async (body: HireDesignerFields) => {
        try {
            const result = await hireDesingerMutatin(body).unwrap()

            return result
        } catch (error) {
            if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR
        }
    }
    const approveOrRejectHireRequest = async (body: AcceptOrRejectHireDesigner) => {
        try {
            const result = await approveOrRejectHireRequestMutation(body).unwrap()
            return result
        } catch (error) {
            if (isApiError(error)) {
                return error.data
            }
            return UNKNOWN_ERROR
        }
    }
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
        editDesign,
        isHiring,
        hireDesigner,
        isApproveOrReject,
        approveOrRejectHireRequest
    }
}