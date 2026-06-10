import { useState } from "react"
import VersionCard from "./VersionCard"
import type { ProposalServiceItemDTO, ServiceStatus, PaymentStatus } from "../proposalInterface"

type Role = "Designer" | "Admin" | "Customer" 

interface ServiceCardProps {
    service: ProposalServiceItemDTO
    role: Role
    isPayLoading: boolean
    onPay?: () => void
    onVerify?: () => void
    onRedo?: () => void
    onUpload: (serviceNumber: number, serviceName: string) => void
}

const statusStyle: Record<ServiceStatus, string> = {
    "Locked": "bg-gray-100 text-gray-500 border-gray-200",
    "Open": "bg-blue-50 text-blue-700 border-blue-200",
    "In Progress": "bg-amber-50 text-amber-700 border-amber-200",
    "Uploaded": "bg-purple-50 text-purple-700 border-purple-200",
    "Redo": "bg-red-50 text-red-700 border-red-200",
    "Completed": "bg-green-50 text-green-700 border-green-200",
}

const paymentStyle: Record<PaymentStatus, string> = {
    "Pending": "bg-amber-50 text-amber-700 border-amber-200",
    "Paid": "bg-green-50 text-green-700 border-green-200",
    "Refunded": "bg-gray-100 text-gray-500 border-gray-200",
}

export default function ServiceCard({ isPayLoading, service, role, onPay, onVerify, onRedo, onUpload }: ServiceCardProps) {
    const [versionsOpen, setVersionsOpen] = useState(false)
    const [openVersionIndex, setOpenVersionIndex] = useState<number | null>(null)

    const isLocked = service.status === "Locked"

    const showPay = role === "Customer" && service.status === "Open"
    const showVerify = role === "Customer" && service.status === "Uploaded"
    const showRedo = role === "Customer" && service.status === "Uploaded"
    const showUpload = role === "Designer" && (
        service.status === "In Progress" ||
        service.status === "Redo" ||
        service.status === "Open"
    )

    const toggleVersion = (index: number) => {
        setOpenVersionIndex(prev => prev === index ? null : index)
    }

    return (
        <div className={`bg-white rounded-xl border border-blush-light/40 p-4 transition-opacity duration-200 ${isLocked ? "opacity-50" : ""}`}>

            {/* Header */}
            <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-soft-black/40">#{service.order}</span>
                    <span className="text-sm font-Jost-Semibold text-soft-black">{service.serviceName}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${paymentStyle[service.paymentStatus]}`}>
                        {service.paymentStatus}
                    </span>
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${statusStyle[service.status]}`}>
                        {service.status}
                    </span>
                </div>
            </div>

            {/* Meta */}
            <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs text-soft-black/50">Due {service.expectedDeliveryDate}</span>
            </div>

            {/* Pricing */}
            <div className="text-xs text-black mb-3">
                ₹{service.price.toLocaleString("en-IN")} service &nbsp;+&nbsp; ₹{service.executionPrice.toLocaleString("en-IN")} execution
            </div>

            {/* Versions */}
            {service.versions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-blush-light/30">
                    <button
                        onClick={() => setVersionsOpen(prev => !prev)}
                        className="flex items-center gap-1.5 text-xs text-soft-black/50 hover:text-soft-black transition-colors mb-2"
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
                                    key={v.versionNumber}
                                    version={v}
                                    isOpen={openVersionIndex === i}
                                    onToggle={() => toggleVersion(i)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Actions */}
            {(showPay || showVerify || showRedo || showUpload) && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-blush-light/30">
                    {showPay && (
                        <button
                            onClick={onPay}
                            disabled={isPayLoading}
                            className="inline-flex items-center justify-center gap-1.5 bg-soft-black text-off-white hover:bg-blush-deep px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                        >
                            {isPayLoading ? "Preparing..." : "Pay"}
                        </button>
                    )}
                    {showVerify && (
                        <button
                            onClick={onVerify}
                            className="inline-flex items-center justify-center gap-1.5 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                        >
                            Verify
                        </button>
                    )}
                    {showRedo && (
                        <button
                            onClick={onRedo}
                            className="inline-flex items-center justify-center gap-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                        >
                            Request redo
                        </button>
                    )}
                    {showUpload && (
                        <button
                            onClick={() => onUpload(service.order, service.serviceName)}
                            className="inline-flex items-center justify-center gap-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                        >
                            Upload result
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}