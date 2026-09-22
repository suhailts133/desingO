import { useApplyForAJob } from "../hooks/useApplyForJob";

interface Props {
    onClose: () => void;
    jobId: string
}

export default function ApplyForJob({ onClose, jobId }: Props) {
    const { handleJobApplication, applyError, applySuccess, isApplying } = useApplyForAJob()

    const onSubmit = async () => {
        console.log(jobId)
        const result = await handleJobApplication(jobId)
        if (result) {
            setTimeout(() => {
                onClose()
            }, 3000);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-surface border border-surface-border rounded-2xl p-8 animate-in zoom-in duration-200">
                <h2 className="text-4xl font-semibold text-accent mb-6 text-center font-Dynalight-Regular">designO</h2>
                <p className="text-center text-lg font-Jost-Semibold text-text-muted mb-6">Do you want to apply for this job?</p>

                <div className="flex flex-col gap-3 pt-4">
                    {!isApplying ? (
                        <button
                            className="w-full py-2.5 bg-accent text-text-on-accent rounded-lg font-medium hover:bg-accent-hover active:bg-accent-active transition-colors"
                            onClick={onSubmit}
                        >
                            Apply
                        </button>
                    ) : (
                        <button
                            type="button"
                            disabled={isApplying}
                            className="w-full py-2.5 bg-surface-hover text-text-faint rounded-lg font-medium flex items-center justify-center transition-colors disabled:cursor-not-allowed"
                        >
                            <svg className="mr-2 size-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Applying...
                        </button>
                    )}
                    <button type="button" onClick={onClose} className="text-text-muted hover:text-text-primary text-sm font-medium transition-colors">Cancel</button>
                </div>
                {applyError && <p className="text-sm text-error text-center mt-4">{applyError}</p>}
                {applySuccess && <p className="text-sm text-success text-center mt-4">{applySuccess}</p>}
            </div>
        </div>
    )
}