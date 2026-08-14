// component/CheckoutForm.tsx
import { useState } from "react"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"

interface CheckoutFormProps {
    onSuccess: (intentId: string) => void
    onCancel: () => void
}

export default function CheckoutForm({ onSuccess, onCancel }: CheckoutFormProps) {
    const stripe = useStripe()
    const elements = useElements()
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handlePay = async () => {
        if (!stripe || !elements) return
        setIsProcessing(true)
        setError(null)

        const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: window.location.href },
            redirect: "if_required",
        })

        if (stripeError) {
            setError(stripeError.message ?? "Payment failed")
        } else if (paymentIntent?.status === "succeeded") {

            onSuccess(paymentIntent.id!)
        }

        setIsProcessing(false)
    }

    return (
        <div className="flex flex-col gap-4">
            <PaymentElement />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <div className="flex gap-2 pt-2">
                <button
                    onClick={handlePay}
                    disabled={!stripe || isProcessing}
                    className="flex-1 bg-soft-black text-off-white hover:bg-blush-deep px-4 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 disabled:opacity-50"
                >
                    {isProcessing ? "Processing..." : "Confirm Payment"}
                </button>
                <button
                    onClick={onCancel}
                    disabled={isProcessing}
                    className="px-4 py-2.5 rounded-lg text-xs font-medium border border-blush-light/40 text-soft-black/60 hover:bg-blush-light/20 transition-all duration-200"
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}