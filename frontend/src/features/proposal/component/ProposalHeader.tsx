import { useNavigate } from "react-router-dom"
import { MessageCircle, ChevronLeft, PencilLine } from "lucide-react"
import type { ContractStatus } from "../proposalInterface"

const contractStatusStyle: Record<ContractStatus, string> = {
    "Sent": "bg-accent-tint text-accent-tint-text border-surface-border",
    "Accepted": "bg-success-tint text-success-text border-success",
    "Rejected": "bg-error-tint text-error-text border-error",
    "Ongoing": "bg-warning-tint text-warning-text border-warning",
    "Completed": "bg-success-tint text-success-text border-success border-2",
    "Disputed": "bg-error-tint text-error-text border-error border-2",
    "Expired": "bg-surface-hover text-text-faint border-surface-border",
    "Terminated": "bg-surface-hover text-text-faint border-surface-border-strong",
}

interface ProposalHeaderProps {
    id: string;
    status: ContractStatus;
    sourceId?: string;
    role: string;
    showUpdateProposal: boolean;
    onChatOpen: () => void
}

export default function ProposalHeader({ onChatOpen, id, status, role, showUpdateProposal }: ProposalHeaderProps) {
    const navigate = useNavigate()

    return (
        <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="text-text-faint hover:text-text-primary transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <span className={`text-xs font-medium px-3 py-1 rounded-full border ${contractStatusStyle[status]}`}>
                    {status}
                </span>

            </div>

            <div className="flex items-center gap-2">
                {showUpdateProposal && (
                    <button
                        onClick={() => navigate(`/proposal/edit/${id}`,)}
                        className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-lg border border-warning bg-warning-tint text-warning-text hover:brightness-110 transition-all duration-200"
                    >
                        <PencilLine className="w-4 h-4" />
                        Update proposal
                    </button>
                )}
                <button
                    onClick={onChatOpen}
                    className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-lg bg-surface text-text-muted border border-surface-border hover:border-surface-border-strong transition-all duration-200"
                >
                    <MessageCircle className="w-4 h-4" />
                    {role === "Designer" ? "Chat with client" : "Chat with designer"}
                </button>
            </div>
        </div>
    )
}