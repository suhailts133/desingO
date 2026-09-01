import type { LucideIcon } from "lucide-react"

type Props = {
    icon: LucideIcon
    label: string
    value: string | number
}

export default function StatCard({ icon: Icon, label, value }: Props) {
    return (
        <div className="bg-off-white rounded-2xl border border-blush-light/40 shadow-lg hover:shadow-2xl transition-shadow duration-300 px-5 py-5 flex flex-col gap-3">
            <div className="w-11 h-11 rounded-full bg-blush-pale flex items-center justify-center">
                <Icon size={20} className="text-blush-deep" />
            </div>
            <p className="text-2xl font-semibold text-soft-black leading-tight">{value}</p>
            <p className="text-xs font-medium text-soft-black/50 uppercase tracking-wide">{label}</p>
        </div>
    )
}