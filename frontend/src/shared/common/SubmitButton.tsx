import type { ReactNode } from "react"

interface Props {
    isLoading: boolean
    label: string
    loadingLabel: string
    onClick?: () => void
    type: "submit" | "button"
    icon?: ReactNode
}

export default function SubmitButton({ isLoading, label, loadingLabel, onClick, type, icon }: Props) {
    if (isLoading) {
        return (
            <button type={type} disabled className="auth-disabled-button flex items-center justify-center gap-2">
                <svg className="mr-2 size-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {loadingLabel}
            </button>
        )
    }

    return (
        <button type={type} onClick={onClick} className="auth-button cursor-pointer">
            {icon && icon}
            {label}
        </button>
    )
}