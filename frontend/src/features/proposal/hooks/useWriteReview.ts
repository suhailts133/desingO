import { useProposalServices } from "../proposalServices"
import type { ReviewPayload } from "../proposalInterface"

export const useWriteReview = () => {
    const { isReviewing, writeReview } = useProposalServices()

    const handleWriteReview = async (payload: ReviewPayload) => await writeReview(payload)

    return {
        isReviewing,
        handleWriteReview,

    }

}