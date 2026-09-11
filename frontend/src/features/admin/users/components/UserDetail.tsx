import { useParams, useNavigate } from "react-router-dom"
import { useGetUserQuery } from "../adminUsersEndpoints"
import { useToggleStatus } from "../hooks/useToggleStatus"
import { useState } from "react"
import ConfirmModal from "../../../../shared/modals/ConfirmModal"
import StatCard from "../../../../shared/dashboard/StatCard"
import { User, Wallet, Briefcase, Layers, Star, ArrowLeft, AlertCircle } from "lucide-react"

export default function UserDetail() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false)

    const { data, isLoading, error } = useGetUserQuery(id!, { skip: !id })
    const { handleToggling, isToggling, error: toggleError, toggle } = useToggleStatus()
    const user = data?.data

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-100">
                <div className="flex items-center gap-3 text-soft-black/40 animate-pulse">
                    <div className="w-5 h-5 border-2 border-blush-deep border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium">Loading user...</span>
                </div>
            </div>
        )
    }

    if (error || !user) {
        return (
            <div className="max-w-2xl mx-auto p-6 mt-10">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm font-medium">Couldn't load this user. Try again.</p>
                </div>
            </div>
        )
    }

    const isBlocked = toggle !== null ? toggle : user.is_blocked
    const isDesigner = user.role === "Designer"

    const onConfirm = () => {
        handleToggling({ id: user.id, is_blocked: !isBlocked })
        setIsModalOpen(false)
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-soft-black/50 hover:text-soft-black transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to users
            </button>

            {/* Identity */}
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-blush-pale flex items-center justify-center overflow-hidden shrink-0">
                    {user.profileImage ? (
                        <img src={user.profileImage} alt={user.full_name} className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-6 h-6 text-blush-deep" />
                    )}
                </div>
                <div className="min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <h1 className="text-2xl font-semibold text-soft-black tracking-tight truncate">{user.full_name}</h1>
                        <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                                isBlocked
                                    ? "bg-red-50 text-error border border-red-200"
                                    : "bg-emerald-50 text-success border border-emerald-200"
                            }`}
                        >
                            {isBlocked ? "Blocked" : "Active"}
                        </span>
                    </div>
                    <p className="text-sm text-soft-black/50 truncate">{user.email}</p>
                </div>
            </div>

            {/* Stats — unchanged */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard icon={Wallet} label="Wallet Balance" value={`$${Number(user.wallet || 0).toFixed(2)}`} />
                <StatCard icon={Briefcase} label="Active Jobs" value={user.activeJobCount} />
                {isDesigner && <StatCard icon={Layers} label="Designs" value={user.designCount ?? 0} />}
                {isDesigner && (
                    <StatCard icon={Star} label="Rating" value={user.rating != null ? user.rating.toFixed(1) : "—"} />
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Details — flat definition list, no card chrome */}
                <div className="lg:col-span-2 border-t border-soft-black/10">
                    <dl>
                        {[
                            { label: "Role", value: user.role },
                            { label: "Sign-in method", value: user.authProvider },
                            { label: "Joined", value: new Date(user.joinedAt).toLocaleDateString() },
                        ].map((row) => (
                            <div key={row.label} className="flex items-center justify-between py-3.5 border-b border-soft-black/10">
                                <dt className="text-sm text-soft-black/50">{row.label}</dt>
                                <dd className="text-sm font-medium text-soft-black">{row.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                {/* Action panel — the one bordered element on the page */}
                <div className="lg:col-span-1 border border-blush-light/40 rounded-2xl p-5 flex flex-col gap-4 h-fit">
                    <div>
                        <p className="text-sm font-semibold text-soft-black">
                            {isBlocked ? "This user is blocked" : "This user is active"}
                        </p>
                        <p className="text-xs text-soft-black/50 mt-1">
                            {isBlocked
                                ? "They can't access the platform until unblocked."
                                : "They have full access to platform services."}
                        </p>
                    </div>

                    {toggleError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-xs">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{toggleError}</span>
                        </div>
                    )}

                    <button
                        onClick={() => setIsModalOpen(true)}
                        disabled={isToggling}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            isBlocked ? "bg-success text-white hover:bg-emerald-700" : "bg-error text-white hover:bg-red-700"
                        }`}
                    >
                        {isToggling ? "Updating..." : isBlocked ? "Unblock user" : "Block user"}
                    </button>
                </div>
            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                onConfirm={onConfirm}
                onClose={() => setIsModalOpen(false)}
                isLoading={isToggling}
                heading={isBlocked ? "Unblock this user?" : "Block this user?"}
                text={
                    isBlocked
                        ? `${user.full_name} will regain full access to the platform services.`
                        : `${user.full_name} will immediately lose access to the platform services.`
                }
                buttonText={isBlocked ? "Yes, Unblock" : "Yes, Block"}
                buttonLoadingText={isBlocked ? "Unblocking..." : "Blocking..."}
            />
        </div>
    )
}