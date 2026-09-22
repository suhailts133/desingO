import { Eye } from "lucide-react";


export default function ViewButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="hover:cursor-pointer flex items-center justify-center w-8 h-8 rounded-lg bg-surface backdrop-blur-sm border border-surface-border text-text-muted hover:text-accent-hover hover:bg-surface-hover transition-all duration-200"
        >
            <Eye size={15} strokeWidth={1.8} />
        </button>
    );
}