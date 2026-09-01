import { useNavigate } from "react-router-dom"
import { Star, Wallet, Lock, CheckCircle2, Palette, ChevronRight, Sparkles } from "lucide-react"
import StatCard from "../component/StatCard"
import type { DesignerDashboardDTO } from "../dashboardInterface"

type Props = {
    data: DesignerDashboardDTO
}

function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
}

export default function DesignerStatsOverview({ data }: Props) {
    const navigate = useNavigate()

    const pendingCount = data.pendingProposals.length
    const disputeCount = data.ongoingDisputes.length
    const activeCount = data.ongoingProposals.length

    const focusLine = (() => {
        if (pendingCount > 0) {
            return `${pendingCount} proposal${pendingCount > 1 ? "s" : ""} waiting on you — let's get those moving.`
        }
        if (disputeCount > 0) {
            return `${disputeCount} dispute${disputeCount > 1 ? "s" : ""} need${disputeCount > 1 ? "" : "s"} your attention.`
        }
        if (activeCount > 0) {
            return `${activeCount} project${activeCount > 1 ? "s" : ""} currently in motion. Keep the momentum going.`
        }
        return "You're all caught up. Great time to pick up something new."
    })()

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                    <p className="text-xs font-medium text-soft-black/40 uppercase tracking-wide">
                        {getGreeting()}
                    </p>
                    <h1 className="text-3xl font-semibold text-soft-black leading-tight">
                        Ready to create, {data.name.split(" ")[0]}?
                    </h1>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <Sparkles size={14} className="text-blush-deep shrink-0" />
                        <p className="text-sm text-soft-black/60">{focusLine}</p>
                    </div>
                </div>

                <button
                    onClick={() => navigate(`/designers/${data.userId}`)}
                    className="flex items-center gap-1 text-sm font-semibold text-blush-deep hover:underline shrink-0 mt-1"
                >
                    View profile <ChevronRight size={16} />
                </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <StatCard icon={Star} label="Rating" value={data.rating.toFixed(1)} />
                <StatCard icon={Wallet} label="Wallet" value={`₹${data.wallet.toLocaleString("en-IN")}`} />
                <StatCard icon={Lock} label="Money held" value={`₹${data.moneyHeld.toLocaleString("en-IN")}`} />
                <StatCard icon={CheckCircle2} label="Completed jobs" value={data.completedJobCount} />
                <StatCard icon={Palette} label="Designs" value={data.designCount} />
            </div>
        </div>
    )
}