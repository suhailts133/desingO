interface ContractOverviewProps {
    proposal: {
        drawingFeePerSqFt: number;
        totalDrawingFee: number;
        totalExecutionFee: number;
        totalContractValue: number;
        expectedCompletionDate: string;
        createdAt: string;
        actualCompletionDate?: string;
    }
}

export default function ContractOverview({ proposal }: ContractOverviewProps) {
    const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`

    return (
        <div className="bg-white rounded-2xl border border-blush-light/40 shadow-sm px-6 py-5">
            <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-soft-black/40 mb-4">
                Contract overview
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                {[
                    { label: "Drawing fee/sqft", value: formatCurrency(proposal.drawingFeePerSqFt) },
                    { label: "Total drawing fee", value: formatCurrency(proposal.totalDrawingFee) },
                    { label: "Execution fee", value: formatCurrency(proposal.totalExecutionFee) },
                    { label: "Contract value", value: formatCurrency(proposal.totalContractValue) },
                ].map(({ label, value }) => (
                    <div key={label} className="bg-blush-pale/30 rounded-xl p-3">
                        <p className="text-xs text-soft-black/40 mb-1">{label}</p>
                        <p className="text-lg font-Jost-Semibold text-soft-black">{value}</p>
                    </div>
                ))}
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
                <div>
                    <p className="text-xs text-soft-black/40 mb-0.5">Expected completion</p>
                    <p className="font-medium text-soft-black">{proposal.expectedCompletionDate}</p>
                </div>
                <div>
                    <p className="text-xs text-soft-black/40 mb-0.5">Created</p>
                    <p className="font-medium text-soft-black">{proposal.createdAt}</p>
                </div>
                {proposal.actualCompletionDate && (
                    <div>
                        <p className="text-xs text-soft-black/40 mb-0.5">Completed on</p>
                        <p className="font-medium text-green-700">{proposal.actualCompletionDate}</p>
                    </div>
                )}
            </div>
        </div>
    )
}