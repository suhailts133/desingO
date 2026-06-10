import type { AllVersion } from "../proposalInterface"

interface VersionCardProps {
    version: AllVersion
    isOpen: boolean
    onToggle: () => void
}

const versionStatusStyle: Record<string, string> = {
    "Approved": "bg-green-50 text-green-700 border-green-200",
    "Rejected": "bg-red-50 text-red-700 border-red-200",
    "Pending": "bg-amber-50 text-amber-700 border-amber-200",
}

export default function VersionCard({ version, isOpen, onToggle }: VersionCardProps) {
    return (
        <div className="rounded-lg border border-blush-light/40 overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <span className="text-xs font-Jost-Semibold text-soft-black">
                        Version {version.versionNumber}
                    </span>
                    <span className={`text-xxs font-medium px-2 py-0.5 rounded-full border ${versionStatusStyle[version.versionData.status]}`}>
                        {version.versionData.status}
                    </span>
                </div>
                <svg
                    className={`w-3 h-3 text-soft-black/40 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="px-3 pb-3">
                    {version.versionData.rejectionReason && (
                        <p className="text-[11px] text-red-600 bg-red-50 rounded px-2 py-1 mt-2">
                            {version.versionData.rejectionReason}
                        </p>
                    )}
                    {version.versionData.images.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {version.versionData.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`version ${version.versionNumber} image ${idx + 1}`}
                                    className="w-14 h-14 object-cover rounded-lg border border-blush-light/40"
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-[11px] text-soft-black/40 mt-2">No images uploaded.</p>
                    )}
                </div>
            )}
        </div>
    )
}