import type { DisputeSolutionDTO } from "../adminDisputeInterface"
import { useAdminDisputeService } from "../adminDisputeService"

export const useDisputeVerdit = () => {

    const { giveVerdit, isSubmitting } = useAdminDisputeService()

    const handleVerditSubmit = async (payload: DisputeSolutionDTO) => {
        return await giveVerdit(payload)

    }

    return { handleVerditSubmit, isSubmitting }
}