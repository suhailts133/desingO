import CheckoutForm from "./CheckoutForm"

interface PaymentModalProps {
    isOpen: boolean
    serviceName: string
    amount: number
    onSuccess: (intentId: string) => void
    onClose: () => void
}

export default function PaymentModal({ isOpen, serviceName, amount, onSuccess, onClose }: PaymentModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-surface border border-surface-border rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-5">
                <div>
                    <h2 className="font-Jost-Semibold text-base text-text-primary">Pay for service</h2>
                    <p className="text-xs text-text-muted mt-0.5">{serviceName}</p>
                </div>

                <div className="bg-surface-hover border border-surface-border rounded-xl px-4 py-3 flex items-center justify-between">
                    <span className="text-xs text-text-muted">Amount</span>
                    <span className="font-Jost-Semibold text-sm text-text-primary">
                        ₹{amount.toLocaleString("en-IN")}
                    </span>
                </div>

                <CheckoutForm onSuccess={onSuccess} onCancel={onClose} />
            </div>
        </div>
    )
}
