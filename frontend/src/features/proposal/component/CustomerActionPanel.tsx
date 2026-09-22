interface CustomerActionPanelProps {
    onAccept: () => void;
    onDecline: () => void;
}

export default function CustomerActionPanel({ onAccept, onDecline }: CustomerActionPanelProps) {
    return (
        <div className="bg-surface rounded-2xl border border-surface-border px-6 py-5">
            <h2 className="font-Jost-Semibold text-xs uppercase tracking-widest text-text-faint mb-1">
                Proposal review
            </h2>
            <p className="text-sm text-text-muted mb-4">
                Review the proposal details below and accept or decline to proceed.
            </p>
            <div className="flex gap-3">
                <button
                    onClick={onAccept}
                    className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-Jost-Semibold py-2.5 px-4 rounded-xl border border-success bg-success-tint text-success-text hover:brightness-110 active:scale-[0.98] transition-all duration-150"
                >
                    <span className="text-base leading-none">✓</span>
                    Accept proposal
                </button>
                <button
                    onClick={onDecline}
                    className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-Jost-Semibold py-2.5 px-4 rounded-xl border border-error bg-error-tint text-error-text hover:brightness-110 active:scale-[0.98] transition-all duration-150"
                >
                    <span className="text-base leading-none">✕</span>
                    Decline proposal
                </button>
            </div>
        </div>
    )
}