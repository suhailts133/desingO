import { useProposalServices } from "../proposalServices"
import type { AcceptOrRejectFloorPlanDTO } from "../proposalInterface"

export const useAcceptOrRejectFloorPlan = () => {
    const { isFloorPlanVerifying, acceptOrRejectFloorPlan } = useProposalServices()


    const handleAcceptOrRejectFloorPlan = async (payload: AcceptOrRejectFloorPlanDTO) => await acceptOrRejectFloorPlan(payload)

    return {
        isFloorPlanVerifying,
        handleAcceptOrRejectFloorPlan,
    }

}