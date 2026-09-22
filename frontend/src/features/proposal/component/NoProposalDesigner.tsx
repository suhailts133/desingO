import { useNavigate } from "react-router-dom"
import { FileX, FilePlus, MessageCircle } from "lucide-react"

interface Props {
    jobId: string,
    sourceType: 'jobRequest' | 'direct_hire',
    sourceId: string
    activeJobId: string
}

export default function NoProposalDesigner({ activeJobId, jobId, sourceType, sourceId }: Props) {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col items-center justify-center gap-4 text-center min-h-[60vh]">
            <FileX className="w-12 h-12 text-text-faint opacity-50" />
            <h2 className="font-Jost-Semibold text-lg text-text-primary">No proposal created yet</h2>
            <p className="text-sm text-text-muted max-w-xs">
                Create a proposal for this job to get started with the client.
            </p>
            <div className="flex items-center gap-3 mt-2">
                <button
                    onClick={() => navigate(`/designer/proposal/create/${jobId}`, { state: { sourceType, sourceId } })
                    }
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-text-on-accent text-sm font-medium hover:bg-accent-hover active:bg-accent-active transition-colors duration-200"
                >
                    <FilePlus className="w-4 h-4" />
                    Create proposal
                </button>
                <button
                    onClick={() => navigate(`/chat/${activeJobId}`)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-surface-border bg-surface text-text-muted text-sm font-medium hover:bg-surface-hover hover:border-surface-border-strong hover:text-text-primary transition-colors duration-200"
                >
                    <MessageCircle className="w-4 h-4" />
                    Chat with client
                </button>
            </div>
        </div>
    )
}