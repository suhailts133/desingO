import { useProposalServices } from "../proposalServices"

export const useVerifyPayment = () => {
    const { isVerifying, getPaymentId } = useProposalServices()


    const handlePaymentIntentVerification = async (intentId: string) => {
        const result = await getPaymentId(intentId)
        return result
    }

    return {
        isVerifying,
        handlePaymentIntentVerification
    }
}