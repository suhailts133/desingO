interface AdvancePaymentPanelProps {
    advanceFee: number;
    advancePaid: boolean;
    advancePaidAt?: string;
    showAdvancePay: boolean;
    onPayAdvance: () => void;
}

export default function AdvancePaymentPanel({ advanceFee, advancePaid, advancePaidAt, showAdvancePay, onPayAdvance }: AdvancePaymentPanelProps) {
    return (
        <div className="bg-white rounded-2xl border border-blush-light/40 shadow-sm px-6 py-5">
            <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-soft-black/40 mb-4">
                Advance payment
            </h2>
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <p className="text-2xl font-Jost-Semibold text-soft-black">
                        ₹{advanceFee.toLocaleString("en-IN")}
                    </p>
                    {advancePaid && advancePaidAt ? (
                        <p className="text-xs text-green-600 mt-1">Paid on {advancePaidAt}</p>
                    ) : (
                        <p className="text-xs text-soft-black/40 mt-1">Required before work begins</p>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full border ${advancePaid
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                        {advancePaid ? "Paid" : "Pending"}
                    </span>
                    {showAdvancePay && (
                        <button onClick={onPayAdvance} className="soft-black-button">
                            Pay advance
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}