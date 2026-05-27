import { useParams, useNavigate } from "react-router-dom"
import { MessageCircle, ChevronLeft } from "lucide-react"
import { useGetProposalQuery } from "../proposalEndpoints"
import { useDecodeAccessToken } from "../../../helpers/decodeAccessToken"

import type { ContractStatus } from "../proposalInterface"
import NoProposalCustomer from "../component/NoProposalCustomer"
import NoProposalDesigner from "../component/NoProposalDesigner"
import ServiceCard from "../component/ServiceCard"

const contractStatusStyle: Record<ContractStatus, string> = {
    "Sent":      "bg-blue-50 text-blue-700 border-blue-200",
    "Accepted":  "bg-green-50 text-green-700 border-green-200",
    "Rejected":  "bg-red-50 text-red-700 border-red-200",
    "Ongoing":   "bg-amber-50 text-amber-700 border-amber-200",
    "Completed": "bg-green-100 text-green-800 border-green-300",
    "Disputed":  "bg-red-100 text-red-800 border-red-300",
    "Expired":   "bg-gray-100 text-gray-500 border-gray-200",
}

export default function ProposalPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { role } = useDecodeAccessToken()
    const { data, isLoading, error } = useGetProposalQuery(id!, { skip: !id })

    if (isLoading) {
        return (
            <div className="w-full flex flex-col gap-6">
                <div className="p-10 text-center animate-pulse text-soft-black/40">
                    Loading proposal...
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="w-full flex flex-col gap-6">
                <div className="p-10 text-center text-red-500 font-Jost-Semibold">
                    Something went wrong. Please try again.
                </div>
            </div>
        )
    }

    const proposal = data?.data

    // ---- No proposal ----
    if (!proposal) {
        return (
            <div className="w-full flex flex-col gap-6">
                {role === "Designer"
                    ? <NoProposalDesigner jobId={id!} />
                    : <NoProposalCustomer jobId={id!} />
                }
            </div>
        )
    }

    // ---- Proposal exists ----
    const advancePaid = proposal.advancePaid
    const showAdvancePay = role === "Customer" && !advancePaid && proposal.contractStatus === "Accepted"

    return (
        <div className="w-full flex flex-col gap-6">

            {/* Top bar */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="text-soft-black/50 hover:text-soft-black transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full border ${contractStatusStyle[proposal.contractStatus]}`}>
                        {proposal.contractStatus}
                    </span>
                    <span className="text-xs text-soft-black/40 capitalize">
                        {proposal.sourceType.replace("_", " ")}
                    </span>
                </div>

                <button
                    onClick={() => navigate(`/chat/${id}`)}
                    className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-lg border border-blush-light/50 bg-off-white hover:bg-blush-pale hover:text-blush-deep transition-all duration-200"
                >
                    <MessageCircle className="w-4 h-4" />
                    {role === "Designer" ? "Chat with client" : "Chat with designer"}
                </button>
            </div>

            {/* Contract overview */}
            <div className="bg-white rounded-2xl border border-blush-light/40 shadow-sm px-6 py-5">
                <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-soft-black/40 mb-4">
                    Contract overview
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                    {[
                        { label: "Drawing fee/sqft", value: `₹${proposal.drawingFeePerSqFt}` },
                        { label: "Total drawing fee", value: `₹${proposal.totalDrawingFee.toLocaleString("en-IN")}` },
                        { label: "Execution fee",     value: `₹${proposal.totalExecutionFee.toLocaleString("en-IN")}` },
                        { label: "Contract value",    value: `₹${proposal.totalContractValue.toLocaleString("en-IN")}` },
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

            {/* Advance payment */}
            <div className="bg-white rounded-2xl border border-blush-light/40 shadow-sm px-6 py-5">
                <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-soft-black/40 mb-4">
                    Advance payment
                </h2>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <p className="text-2xl font-Jost-Semibold text-soft-black">
                            ₹{proposal.advanceFee.toLocaleString("en-IN")}
                        </p>
                        {advancePaid && proposal.advancePaidAt && (
                            <p className="text-xs text-green-600 mt-1">Paid on {proposal.advancePaidAt}</p>
                        )}
                        {!advancePaid && (
                            <p className="text-xs text-soft-black/40 mt-1">Required before work begins</p>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`text-xs font-medium px-3 py-1 rounded-full border ${
                            advancePaid
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                            {advancePaid ? "Paid" : "Pending"}
                        </span>
                        {showAdvancePay && (
                            <button
                                onClick={() => {/* trigger stripe advance payment */}}
                                className="gradient-button text-sm"
                            >
                                Pay advance
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Rejection reason */}
            {proposal.overallRejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-2xl px-6 py-4">
                    <p className="text-xs font-Jost-Semibold text-red-700 uppercase tracking-widest mb-1">
                        Rejection reason
                    </p>
                    <p className="text-sm text-red-700">{proposal.overallRejectionReason}</p>
                </div>
            )}

            {/* Services */}
            <div className="bg-white rounded-2xl border border-blush-light/40 shadow-sm px-6 py-5">
                <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-soft-black/40 mb-4">
                    Services
                </h2>
                <div className="flex flex-col gap-3">
                    {proposal.services
                        .sort((a, b) => a.order - b.order)
                        .map((service) => (
                            <ServiceCard
                                key={service.order}
                                service={service}
                                role={role}
                                onPay={() => {/* trigger stripe service payment */}}
                                onVerify={() => {/* trigger verify */}}
                                onRedo={() => {/* trigger redo */}}
                                onUpload={() => {/* trigger upload modal */}}
                            />
                        ))}
                </div>
            </div>

        </div>
    )
}