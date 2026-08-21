import { useProposalServices } from "../proposalServices"

export const useUploadFloorPlan = () => {
    const { isFloorPlanUploading, uploadFloorPlan } = useProposalServices()

    const handleFloorPlanSubmission = async (formData: FormData) => await uploadFloorPlan(formData)

    return {
        isFloorPlanUploading,
        handleFloorPlanSubmission,

    }

}