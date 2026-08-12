import { useState } from "react"
import { useProposalServices } from "../proposalServices"

export const useCreateIntent = () => {
    const { ispaymentDataLoading, createIntent } = useProposalServices()
    const [clientSecret, setClientSecret] = useState<string | null>(null)
    const [paymentIntentError, setPaymentIntentError] = useState<string | null>(null)
    const handlePaymentIntent = async (jobId: string): Promise<boolean> => {
        setPaymentIntentError(null)
        setClientSecret(null)
        const result = await createIntent(jobId)
        if (result.success) {
            setClientSecret(result.data as string)
            return true
        } else {
            setPaymentIntentError(result.message as string)
            setTimeout(() => setPaymentIntentError(""), 3000)
            return false
        }
    }

    const reset = () => {
        setClientSecret(null)
        setPaymentIntentError(null)
    }

    return {
        reset,
        ispaymentDataLoading,
        clientSecret,
        paymentIntentError,
        handlePaymentIntent
    }

}