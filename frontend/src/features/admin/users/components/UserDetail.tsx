import { useParams, useNavigate } from "react-router-dom"
import { useGetUserQuery } from "../adminUsersEndpoints"
import { useToggleStatus } from "../hooks/useToggleStatus"
import { useState } from "react"
import ConfirmModal from "../../../../shared/modals/ConfirmModal"
import StatCard from "../../../../shared/dashboard/StatCard"
import { User, Wallet, ArrowLeft, Mail, Shield, Calendar, AlertCircle } from "lucide-react"

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
                <div className="flex items-center gap-3 text-gray-500 animate-pulse">
                    <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium">Loading user profile...</span>
                </div>
            </div>
        )
    }

    if (error || !user) {
        return (
            <div className="max-w-2xl mx-auto p-6 mt-10">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm font-medium">Failed to load user details. Please try again later.</p>
                </div>
            </div>
        )
    }

    const isBlocked = toggle !== null ? toggle : user.is_blocked

    const onConfirm = () => {
        handleToggling({ id: user.id, is_blocked: !isBlocked })
        setIsModalOpen(false)
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Navigation Header */}
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Users
            </button>

            {/* Top Stat Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                    icon={Wallet}
                    label="Wallet Balance"
                    value={`$${Number(user.wallet || 0).toFixed(2)}`}
                />
            </div>

            {/* Main Profile Card */}
            <div className="bg-white shadow-sm rounded-2xl border border-gray-200 overflow-hidden">
                {/* Profile Banner Header */}
                <div className="bg-soft-black px-6 py-8 text-off-white relative">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/20 flex items-center justify-center overflow-hidden shadow-inner shrink-0">
                            {user.profileImage ? (
                                <img
                                    src={user.profileImage}
                                    alt={user.full_name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-8 h-8 text-white/70" />
                            )}
                        </div>

                        {/* Name & Status */}
                        <div className="space-y-1 flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl font-bold tracking-tight">{user.full_name}</h1>
                                <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider ${isBlocked
                                    ? "bg-red-500/20 text-error border border-red-500/30"
                                    : "bg-emerald-500/20 text-success border border-emerald-500/30"
                                    }`}>
                                    {isBlocked ? "Blocked" : "Active"}
                                </span>
                            </div>
                            <p className="text-gray-300 text-sm flex items-center gap-1.5">
                                <Mail className="w-4 h-4 text-gray-400" />
                                {user.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Profile Details Grid */}
                <div className="p-6 space-y-6">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Account Details</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="p-2 rounded-lg bg-white shadow-sm text-gray-600">
                                <Shield className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Role</p>
                                <p className="text-sm font-semibold text-gray-800 capitalize">{user.role}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="p-2 rounded-lg bg-white shadow-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Joined Date</p>
                                <p className="text-sm font-semibold text-gray-800">{new Date(user.joinedAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                    </div>

                    {toggleError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-xs">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{toggleError}</span>
                        </div>
                    )}

                    {/* Action Footer */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            disabled={isToggling}
                            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${isBlocked
                                ? "bg-success text-white hover:bg-emerald-700 shadow-emerald-100"
                                : "bg-error text-white hover:bg-red-700 shadow-red-100"
                                }`}
                        >
                            {isToggling ? "Updating..." : isBlocked ? "Unblock User" : "Block User"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
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