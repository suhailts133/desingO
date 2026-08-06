import { useDisputeServices } from "../disputeServices"
import type { AcceptOrRejectDisputeDTO } from "../proposalInterface"

export const useAcceptOrRejectVerdit = () => {

    const { acceptOrRejectDisputeVerdit, isChecking } = useDisputeServices()

    const handleVerditSubmit = async (payload: AcceptOrRejectDisputeDTO) => {
        return await acceptOrRejectDisputeVerdit(payload)

    }

    return { handleVerditSubmit, isChecking }
}