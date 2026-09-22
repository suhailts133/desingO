import { dateFormater } from "../../../helpers/dateFormater";

interface ContractOverviewProps {
    proposal: {
        drawingFeePerSqFt: number;
        totalDrawingFee: number;
        totalExecutionFee: number;
        totalContractValue: number;
        expectedCompletionDate: string;
        createdAt: string;
        siteVisitingRequired: boolean
        expectedSiteVisitingDate?: string
        actualCompletionDate?: string;
    }
}

export default function ContractOverview({ proposal }: ContractOverviewProps) {
    const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`

    return (
        <div className="bg-surface rounded-2xl border border-surface-border px-6 py-5">
            <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-text-faint mb-4">
                Contract overview
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                {[
                    { label: "Drawing fee/sqft", value: formatCurrency(proposal.drawingFeePerSqFt) },
                    { label: "Total drawing fee", value: formatCurrency(proposal.totalDrawingFee) },
                    { label: "Execution fee", value: formatCurrency(proposal.totalExecutionFee) },
                    { label: "Contract value", value: formatCurrency(proposal.totalContractValue) },
                ].map(({ label, value }) => (
                    <div key={label} className="bg-surface-hover rounded-xl p-3">
                        <p className="text-xs text-text-faint mb-1">{label}</p>
                        <p className="text-lg font-Jost-Semibold text-text-primary">{value}</p>
                    </div>
                ))}
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
                <div>
                    <p className="text-xs text-text-faint mb-0.5">Expected completion</p>
                    <p className="font-medium text-text-primary">{dateFormater(proposal.expectedCompletionDate)}</p>
                </div>
                {proposal.siteVisitingRequired && proposal.expectedSiteVisitingDate && (
                    <div>
                        <p className="text-xs text-text-faint mb-0.5">Site Visiting</p>
                        <p className="font-medium text-text-primary">{dateFormater(proposal.expectedSiteVisitingDate)}</p>
                    </div>
                )}

                <div>
                    <p className="text-xs text-text-faint mb-0.5">Created</p>
                    <p className="font-medium text-text-primary">{proposal.createdAt}</p>
                </div>
                {proposal.actualCompletionDate && (
                    <div>
                        <p className="text-xs text-text-faint mb-0.5">Completed on</p>
                        <p className="font-medium text-success-text">{proposal.actualCompletionDate}</p>
                    </div>
                )}
            </div>
        </div>
    )
}