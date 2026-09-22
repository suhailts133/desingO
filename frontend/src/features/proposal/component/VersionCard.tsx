import type { AllVersion } from "../proposalInterface"
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css"
interface VersionCardProps {
    version: AllVersion
    isOpen: boolean
    onToggle: () => void
}

const versionStatusStyle: Record<string, string> = {
    "Approved": "bg-success-tint text-success-text border-success",
    "Rejected": "bg-error-tint text-error-text border-error",
    "Pending": "bg-warning-tint text-warning-text border-warning",
}

export default function VersionCard({ version, isOpen, onToggle }: VersionCardProps) {

    return (
        <div className="rounded-lg border border-surface-border overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between px-3 py-2 bg-surface-hover hover:bg-surface transition-colors"
            >
                <div className="flex items-center gap-2">
                    <span className="text-xs font-Jost-Semibold text-text-primary">
                        Version {version.versionNumber}
                    </span>
                    <span className="text-xs font-Jost-Semibold text-text-primary">
                        UploadedAt {version.uploadedAt}
                    </span>
                    <span className={`text-xxs font-medium px-2 py-0.5 rounded-full border ${versionStatusStyle[version.versionData.status]}`}>
                        {version.versionData.status}
                    </span>
                </div>
                <svg
                    className={`w-3 h-3 text-text-faint transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
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
                        <p className="text-[11px] text-error-text bg-error-tint rounded px-2 py-1 mt-2">
                            {version.versionData.rejectionReason}
                        </p>
                    )}
                    {version.versionData.images.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {version.versionData.images.map((img, idx) => (
                                <Zoom>
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`version ${version.versionNumber} image ${idx + 1}`}
                                        className="w-14 h-14 object-cover rounded-lg border border-surface-border"
                                    />
                                </Zoom>

                            ))}
                        </div>
                    ) : (
                        <p className="text-[11px] text-text-faint mt-2">No images uploaded.</p>
                    )}
                </div>
            )}
        </div>
    )
}