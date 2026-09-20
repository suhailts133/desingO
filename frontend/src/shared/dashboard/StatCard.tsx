import type { LucideIcon } from "lucide-react"

type Props = {
    icon: LucideIcon
    label: string
    value: string | number
}

export default function StatCard({ icon: Icon, label, value }: Props) {
    return (
        <div className="bg-surface rounded-2xl border border-surface-border hover:border-accent transition-colors duration-300 px-5 py-5 flex flex-col gap-3">
            <div className="w-11 h-11 rounded-full bg-accent-tint flex items-center justify-center">
                <Icon size={20} className="text-accent-tint-text" />
            </div>
            <p className="text-2xl font-semibold text-text-primary leading-tight">{value}</p>
            <p className="text-xs font-medium text-text-faint uppercase tracking-wide">{label}</p>
        </div>
    )
}