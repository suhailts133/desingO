import { useState } from "react"
import VersionCard from "./VersionCard"
import type { ProposalServiceItemDTO, ServiceStatus, PaymentStatus, EscrowStatus } from "../proposalInterface"
import { dateFormater } from "../../../helpers/dateFormater"
import EscrowStatusBadge from "./EscrowStatusBadge"

type Role = "Designer" | "Admin" | "Customer"

interface ServiceCardProps {
    service: ProposalServiceItemDTO
    role: Role
    isPayLoading: boolean
    onPay?: () => void
    onVerify: (versionId: string) => void
    onRedo: (versionId: string) => void
    onUpload: (serviceNumber: number, serviceName: string) => void
}
const escrowStatusStyle: Record<EscrowStatus, string> = {
    "Held": "bg-warning-tint text-warning-text border-warning",
    "Released": "bg-success-tint text-success-text border-success",
    "Refunded": "bg-accent-tint text-accent-tint-text border-surface-border",
    "Disputed": "bg-error-tint text-error-text border-error",
}

const statusStyle: Record<ServiceStatus, string> = {
    "Locked": "bg-surface-hover text-text-faint border-surface-border",
    "Open": "bg-accent-tint text-accent-tint-text border-surface-border",
    "In Progress": "bg-warning-tint text-warning-text border-warning",
    "Uploaded": "bg-accent-tint text-accent-tint-text border-accent",
    "Redo": "bg-error-tint text-error-text border-error",
    "Completed": "bg-success-tint text-success-text border-success",
}

const paymentStyle: Record<PaymentStatus, string> = {
    "Pending": "bg-warning-tint text-warning-text border-warning",
    "Paid": "bg-success-tint text-success-text border-success",
    "Refunded": "bg-surface-hover text-text-faint border-surface-border",
}

export default function ServiceCard({ isPayLoading, service, role, onPay, onVerify, onRedo, onUpload }: ServiceCardProps) {
    const [versionsOpen, setVersionsOpen] = useState(false)
    const [openVersionIndex, setOpenVersionIndex] = useState<number | null>(null)

    const isLocked = service.status === "Locked"

    const showPay = role === "Customer" && service.paymentStatus === "Pending"
    const showVerify = role === "Customer" && service.status === "Uploaded"
    const showRedo = role === "Customer" && service.status === "Uploaded"
    const showUpload = role === "Designer" && (
        service.status === "In Progress" ||
        service.status === "Redo"
    )
    const latestVersion = service.versions.find(e => e.versionData.status === "Pending")
    const latestVersionId = latestVersion?.versionData.versionId

    const toggleVersion = (index: number) => {
        setOpenVersionIndex(prev => prev === index ? null : index)
    }

    return (
        <div className={`bg-surface rounded-xl border border-surface-border p-4 transition-opacity duration-200 ${isLocked ? "opacity-50" : ""}`}>

            {/* Header */}
            <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-text-faint">#{service.order}</span>
                    <span className="text-sm font-Jost-Semibold text-text-primary">{service.serviceName}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${paymentStyle[service.paymentStatus]}`}>
                        {service.paymentStatus}
                    </span>
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${statusStyle[service.status]}`}>
                        {service.status}
                    </span>
                    {  service.escrowStatus && (
                        <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${escrowStatusStyle[service.escrowStatus]}`}>
                            {service.escrowStatus}
                        </span>
                    )}


                </div>
            </div>

            {/* Meta */}
            <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs text-text-faint">
                    Due {dateFormater(service.expectedDeliveryDate)}
                </span>
            </div>

            {/* Pricing */}
            <div className="mb-3 space-y-1.5">
                <div className="text-xs text-text-primary">
                    ₹{service.price.toLocaleString("en-IN")} service &nbsp;+&nbsp; ₹{service.executionPrice.toLocaleString("en-IN")} execution
                </div>

                {service.escrowStatus && service.amountHeld && (
                    <EscrowStatusBadge amount={service.amountHeld} status={service.escrowStatus} />
                )}
            </div>

            {/* Versions */}
            {service.versions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-surface-border">
                    <button
                        onClick={() => setVersionsOpen(prev => !prev)}
                        className="flex items-center gap-1.5 text-xs text-text-faint hover:text-text-primary transition-colors mb-2"
                    >
                        <span>{service.versions.length} version{service.versions.length > 1 ? "s" : ""}</span>
                        <svg
                            className={`w-3 h-3 transition-transform duration-200 ${versionsOpen ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {versionsOpen && (
                        <div className="flex flex-col gap-2">
                            {service.versions.map((v, i) => (
                                <VersionCard
                                    key={v.versionData.versionId}
                                    version={v}
                                    isOpen={openVersionIndex === i}
                                    onToggle={() => toggleVersion(i)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {(showPay || showVerify || showRedo || showUpload) && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-surface-border">
                    {showPay && (
                        <button
                            onClick={onPay}
                            disabled={isPayLoading}
                            className="inline-flex items-center justify-center gap-1.5 bg-accent text-text-on-accent hover:bg-accent-hover active:bg-accent-active px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                        >
                            {isPayLoading ? "Preparing..." : "Pay"}
                        </button>
                    )}
                    {showVerify && (
                        <button
                            onClick={() => latestVersionId && onVerify?.(latestVersionId)}
                            className="inline-flex items-center justify-center gap-1.5 bg-success-tint text-success-text border border-success hover:brightness-110 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                        >
                            Verify
                        </button>
                    )}
                    {showRedo && (
                        <button
                            onClick={() => latestVersionId && onRedo?.(latestVersionId)}
                            className="inline-flex items-center justify-center gap-1.5 bg-error-tint text-error-text border border-error hover:brightness-110 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                        >
                            Request redo
                        </button>
                    )}
                    {showUpload && (
                        <button
                            onClick={() => onUpload(service.order, service.serviceName)}
                            className="inline-flex items-center justify-center gap-1.5 bg-warning-tint text-warning-text border border-warning hover:brightness-110 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                        >
                            Upload result
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}