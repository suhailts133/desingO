import { useNavigate } from "react-router-dom";

export default function UserClickable(name: string, role: string, id: string) {
    const navigate = useNavigate();
    const isClickable = role === "Customer" || role === "Designer";
    return (
        <button
            type="button"
            disabled={!isClickable}
            onClick={() => isClickable && navigate(`/admin/users/${id}`)}
            className={`font-Jost-Semibold text-sm text-left ${isClickable ? "text-accent hover:text-accent-hover hover:underline cursor-pointer" : "text-text-primary cursor-default"
                }`}
        >
            {name}
        </button>
    );
}