
import { useDesignServices } from "../designService"
import type { AcceptOrRejectHireDesigner } from "../designInterface"

export const useApproveOrRejectHireRequest = () => {
    const { approveOrRejectHireRequest, isApproveOrReject } = useDesignServices()


    const handleSubmission = async (body: AcceptOrRejectHireDesigner) => await approveOrRejectHireRequest(body);

    return {
        handleSubmission,
        isApproveOrReject,

    }
}