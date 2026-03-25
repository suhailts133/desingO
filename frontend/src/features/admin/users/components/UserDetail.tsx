import { useParams, useNavigate } from "react-router-dom"
import { useGetUserQuery } from "../adminUsersEndpoints"
import { useToggleStatus } from "../hooks/useToggleStatus"

export default function UserDetail() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const { data, isLoading, error } = useGetUserQuery(id!, { skip: !id })
    const { handleToggling, isToggling, error: toggleError, toggle } = useToggleStatus()
    const user = data?.data
    if (isLoading) return <div className="p-6 text-gray-500">Loading user...</div>
    if (error || !user) return <div className="p-6 text-red-500">Failed to load user.</div>
    const isBlocked = toggle !== null ? toggle : user.is_blocked
    const onToggle = () => handleToggling({ id: user.id, is_blocked: !isBlocked })

    return (
        <div className="max-w-2xl mx-auto p-6">
            <button onClick={() => navigate(-1)} className="mb-4 text-sm text-blue-600 hover:underline">
                ← Back
            </button>

            <div className="bg-white shadow rounded-xl p-6 space-y-4 border border-gray-100 ">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-800">{user.full_name}</h1>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${isBlocked ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                        {isBlocked ? "Blocked" : "Active"}
                    </span>
                </div>

                <div className="text-sm text-gray-500 space-y-2">
                    <p><span className="font-medium text-gray-700">Email:</span> {user.email}</p>
                    <p><span className="font-medium text-gray-700">Role:</span> {user.role}</p>
                    <p><span className="font-medium text-gray-700">ID:</span> {user.id}</p>
                    <p><span className="font-medium text-gray-700">Joined:</span> {new Date(user.joinedAt).toLocaleDateString()}</p>
                </div>

                {toggleError && (
                    <p className="text-xs text-red-500">{toggleError}</p>
                )}

                <button
                    onClick={onToggle}
                    disabled={isToggling}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isBlocked
                        ? "bg-green-50 text-green-600 border border-green-200 hover:bg-green-100"
                        : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                        }`}
                >
                    {isToggling ? "Updating..." : isBlocked ? "Unblock User" : "Block User"}
                </button>
            </div>
        </div>
    )
}