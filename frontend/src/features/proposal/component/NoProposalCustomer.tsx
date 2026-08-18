// NoProposalCustomer.tsx
import { useNavigate } from "react-router-dom"
import { FileX, MessageCircle } from "lucide-react"

interface Props {
    activeJobId: string
}

export default function NoProposalCustomer({ activeJobId }: Props) {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col items-center justify-center gap-4 text-center min-h-[60vh]">
            <FileX className="w-12 h-12 text-soft-black/20" />
            <h2 className="font-Jost-Semibold text-lg text-soft-black">Proposal not ready yet</h2>
            <p className="text-sm text-soft-black/50 max-w-xs leading-relaxed">
                The designer hasn't created a proposal yet. Please wait or contact the designer directly.
            </p>
            <button
                onClick={() => navigate(`/chat/${activeJobId}`)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-blush-light/50 bg-off-white text-soft-black text-sm font-medium hover:bg-blush-pale hover:text-blush-deep transition-all duration-200 mt-2"
            >
                <MessageCircle className="w-4 h-4" />
                Chat with designer
            </button>
        </div>
    )
}