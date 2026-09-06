import { Eye } from "lucide-react";


export default function ViewButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="hover:cursor-pointer flex items-center justify-center w-8 h-8 rounded-lg bg-white/30 backdrop-blur-sm border border-white/40 text-soft-black/60 hover:text-blush-deep hover:bg-white/60 transition-all duration-200"
        >
            <Eye size={15} strokeWidth={1.8} />
        </button>
    );
}