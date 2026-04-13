import {  useApproveOrRejectJobApplicationMutation } from "./jobApplicationEndpoints";
import type { JobApplicationApprovalOrRejectionPayload } from "./jobApplicationInterFace";

export const useJobApplicationServices = () => {
    
    const [approveOrRejectionMutation, {isLoading:isApproving}] = useApproveOrRejectJobApplicationMutation()



    const approveOrReject = async (payload:JobApplicationApprovalOrRejectionPayload) => {
        try {
            const result = await approveOrRejectionMutation(payload).unwrap()
            return result
        } catch (error:any) {
            return error.data
        }
    }



    return {
        approveOrReject,
        isApproving
    }
}