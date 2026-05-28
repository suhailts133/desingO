import type { ImageUploadResult } from "../../designer/profile/designerProfileInterface"
import type { ProposalServiceItemDTO, ServiceStatus, PaymentStatus } from "../proposalInterface"


type Role = "Designer" | "Admin" | "Customer" | null

interface ServiceCardProps {
    service: ProposalServiceItemDTO
    role: Role
    onPay?: () => void
    onVerify?: () => void
    onRedo?: () => void
    onUpload?: () => void
}

const statusStyle: Record<ServiceStatus, string> = {
    "Locked":      "bg-gray-100 text-gray-500 border-gray-200",
    "Open":        "bg-blue-50 text-blue-700 border-blue-200",
    "In Progress": "bg-amber-50 text-amber-700 border-amber-200",
    "Uploaded":    "bg-purple-50 text-purple-700 border-purple-200",
    "Redo":        "bg-red-50 text-red-700 border-red-200",
    "Completed":   "bg-green-50 text-green-700 border-green-200",
}

const paymentStyle: Record<PaymentStatus, string> = {
    "Pending":  "bg-amber-50 text-amber-700 border-amber-200",
    "Paid":     "bg-green-50 text-green-700 border-green-200",
    "Refunded": "bg-gray-100 text-gray-500 border-gray-200",
}

// function RevisionDots({ used, limit }: { used: number; limit: number }) {
//     return (
//         <div className="flex items-center gap-1.5">
//             <span className="text-xs text-soft-black/50">Revisions</span>
//             <div className="flex gap-1">
//                 {Array.from({ length: limit }).map((_, i) => (
//                     <span
//                         key={i}
//                         className={`w-2 h-2 rounded-full ${i < used ? "bg-red-400" : "bg-green-300"}`}
//                     />
//                 ))}
//             </div>
//             <span className="text-xs text-soft-black/50">{used}/{limit}</span>
//         </div>
//     )
// }

function ImageGrid({ images }: { images: ImageUploadResult[] }) {
    if (!images.length) return null
    return (
        <div className="flex flex-wrap gap-2 mt-3">
            {images.map((img, i) => (
                <img
                    key={i}
                    src={img.path}
                    alt={`upload ${i + 1}`}
                    className="w-14 h-14 object-cover rounded-lg border border-blush-light/40"
                />
            ))}
        </div>
    )
}

export default function ServiceCard({ service, role, onPay, onVerify, onRedo, onUpload }: ServiceCardProps) {
    const isLocked = service.status === "Locked"
    const hasImages = service.uploadedImages.length > 0

    const showPay = role === "Customer" && service.status === "Open"
    const showVerify = role === "Customer" && service.status === "Uploaded" && hasImages
    const showRedo = role === "Customer" && service.status === "Uploaded" && hasImages
    const showUpload = role === "Designer" && (
        service.status === "In Progress" ||
        service.status === "Redo" ||
        service.status === "Open"
    )

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
                {/* <RevisionDots used={service.revisionsUsed} limit={service.revisionLimit} /> */}
            </div>

            {/* Pricing */}
            <div className="text-xs text-black mb-3">
                ₹{service.price.toLocaleString("en-IN")} service &nbsp;+&nbsp; ₹{service.executionPrice.toLocaleString("en-IN")} execution
            </div>

            {/* Images */}
            <ImageGrid images={service.uploadedImages} />

            {/* Actions */}
            {(showPay || showVerify || showRedo || showUpload) && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-blush-light/30">
                    {showPay && (
                        <button
                            onClick={onPay}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-soft-black text-off-white hover:bg-blush-deep px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                        >
                            Pay
                        </button>
                    )}
                    {showVerify && (
                        <button
                            onClick={onVerify}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                        >
                            Verify
                        </button>
                    )}
                    {showRedo && (
                        <button
                            onClick={onRedo}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                        >
                            Request redo
                        </button>
                    )}
                    {showUpload && (
                        <button
                            onClick={onUpload}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                        >
                            Upload result
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}