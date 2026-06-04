import { useState } from "react"
import { useProposalServices } from "../proposalServices"
import type { ReviewPayload } from "../proposalInterface"

export const useWriteReview = () => {
    const { isReviewing, writeReview } = useProposalServices()
    const [reviewError, setReviewError] = useState<string | null>(null)
    const [reivewSuccess, setReviewSuccess] = useState<string | null>(null)

    const handleWriteReview = async (payload: ReviewPayload): Promise<boolean> => {
        setReviewError(null)
        setReviewError(null)
        const result = await writeReview(payload)

        if (result.success) {
            setReviewSuccess(result.message as string)
            setTimeout(() => setReviewSuccess(null), 2000)
            return true
        } else {
            setReviewError(result.message as string)
            setTimeout(() => setReviewError(""), 3000)
            return false
        }
    }

    return {
        isReviewing,
        handleWriteReview,
        reivewSuccess,
        reviewError
    }

}