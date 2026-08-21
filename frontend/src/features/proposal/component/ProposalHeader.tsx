import { useNavigate } from "react-router-dom"
import { MessageCircle, ChevronLeft, PencilLine } from "lucide-react"
import type { ContractStatus } from "../proposalInterface"

const contractStatusStyle: Record<ContractStatus, string> = {
    "Sent": "bg-blue-50 text-blue-700 border-blue-200",
    "Accepted": "bg-green-50 text-green-700 border-green-200",
    "Rejected": "bg-red-50 text-red-700 border-red-200",
    "Ongoing": "bg-amber-50 text-amber-700 border-amber-200",
    "Completed": "bg-green-100 text-green-800 border-green-300",
    "Disputed": "bg-red-100 text-red-800 border-red-300",
    "Expired": "bg-gray-100 text-gray-500 border-gray-200",
}

interface ProposalHeaderProps {
    id: string;
    status: ContractStatus;
    sourceId?: string;
    role: string;
    showUpdateProposal: boolean;
    onChatOpen: () => void
}

export default function ProposalHeader({onChatOpen, id, status, role, showUpdateProposal }: ProposalHeaderProps) {
    const navigate = useNavigate()

    return (
        <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="text-soft-black/50 hover:text-soft-black transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <span className={`text-xs font-medium px-3 py-1 rounded-full border ${contractStatusStyle[status]}`}>
                    {status}
                </span>
            
            </div>

            <div className="flex items-center gap-2">
                {showUpdateProposal  && (
                    <button
                        onClick={() => navigate(`/proposal/edit/${id}`,)}
                        className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-lg border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all duration-200"
                    >
                        <PencilLine className="w-4 h-4" />
                        Update proposal
                    </button>
                )}
                <button
                    onClick={onChatOpen}
                    className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-lg border border-blush-light/50 bg-off-white hover:bg-blush-pale hover:text-blush-deep transition-all duration-200"
                >
                    <MessageCircle className="w-4 h-4" />
                    {role === "Designer" ? "Chat with client" : "Chat with designer"}
                </button>
            </div>
        </div>
    )
}