import { Eye, Search } from "lucide-react";
import { useGetAllDesignerRequestsQuery } from "../adminDesignerVerificationEndpoints"
import type { AdminDesignersResponseDTO } from "../adminDesignerVerificationInterfaces";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { AdminDesignerVerificationFilter } from "../../users/adminUserInterface";
import { joiResolver } from "@hookform/resolvers/joi";
import { adminDesignerVerificationFilter } from "../../../../validations/adminValidations";
import { useEffect, useState } from "react";
import Pagination from "../../../../shared/common/Pagination";

export default function DesignerVerificationTable() {
    const [page, setPage] = useState(1);
    const [debouncedName, setDebouncedName] = useState("");

    const { register, watch, formState: { errors } } = useForm<AdminDesignerVerificationFilter>({
        resolver: joiResolver(adminDesignerVerificationFilter),
        defaultValues: { name: "", status: "All" }
    })
    const { name, status } = watch()
    const { data, isLoading, error } = useGetAllDesignerRequestsQuery({ debouncedName, status, page });
    const navigate = useNavigate()
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedName(name ?? "")
            setPage(1)
        }, 500);
        return () => clearTimeout(timer)
    }, [name])


    const getDesignerRequest = (id: string) => {
        navigate(`/admin/designer-requests/${id}`)
    }
    const result = data?.data;
    const totalResult = data?.total ?? 0;
    const totalPages = data?.totalPages ?? 1

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading designer Requests</p>;
    return (
        <div className="min-h-screen">
            <h1 className="font-Jost-Semibold text-3xl text-soft-black">Design Verification</h1>
            <p className="text-soft-black/50 text-sm mt-1">{totalResult} Designer Requests found</p>

            <form>
                <div className="rounded-2xl flex items-center justify-center gap-3 mb-5 bg-white/50 p-5">
                    <div className="relative w-70">
                        <input type="text" className="auth-input" {...register("name")} placeholder="Enter a name" />
                        <button type="button" className="absolute right-3 inset-y-0 flex items-center text-gray-500">
                            <Search />
                        </button>
                    </div>

                    <div className="w-30">
                        <select className="auth-input" {...register("status")}>
                            <option value="All">All</option>
                            <option value="Approved">Approved</option>
                            <option value="Pending">Pending</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>


                </div>
            </form>

            {Object.keys(errors).length > 0 && (
                <div className="mt-3 px-4 py-3 rounded-xl bg-error/10 border border-error/20">
                    {errors.name && <p className="text-error text-xs">{errors.name.message}</p>}
                    {errors.status && <p className="text-error text-xs">{errors.status.message}</p>}
                </div>
            )}



            {/* table */}
            <div className="bg-white/20 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-[0_8px_32px_rgba(216,160,144,0.15)] overflow-hidden">
                <table className="w-full">
                    <thead className="border-b-2 border-soft-black/20">
                        <tr className="border-b border-white/25 bg-white/20 backdrop-blur-2xl">
                            {["Name", "Joined", "Status", "View"].map(h => (
                                <th key={h} className="text-left px-5 py-3.5 text-xs font-Jost-Semibold text-soft-black/50 uppercase tracking-widest">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {result?.map((data: AdminDesignersResponseDTO, i: number) => (
                            <tr
                                key={data.id}
                                className={`${i % 2 === 0 ? "bg-white/50" : ""}  transition-colors duration-150 hover:bg-white/20 ${i !== (result.length - 1) ? "border-b border-white/20" : ""}`}
                            >

                                <td className="px-5 py-3.5">
                                    <p className="font-Jost-Semibold text-soft-black text-sm">{data.full_name}</p>
                                </td>

                                <td className="px-5 py-3.5">
                                    <p className="text-soft-black/60 text-sm">{new Date(data.createdAt).toLocaleDateString()}</p>
                                </td>

                                <td className="px-5 py-3.5">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-Jost-Semibold ${data.status === "Approved"
                                        ? "bg-success/10 text-success border border-success/20"
                                        : data.status === "Rejected"
                                            ? "bg-error/10 text-error border border-error/20"
                                            : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${data.status === "Approved"
                                            ? "bg-success"
                                            : data.status === "Rejected"
                                                ? "bg-error"
                                                : "bg-yellow-500"
                                            }`} />
                                        {data.status}
                                    </span>
                                </td>
                                <td className="px-5 py-3.5">
                                    <button onClick={() => getDesignerRequest(data.id)} className="hover:cursor-pointer flex items-center justify-center w-8 h-8 rounded-lg bg-white/30 backdrop-blur-sm border border-white/40 text-soft-black/60 hover:text-blush-deep hover:bg-white/60 transition-all duration-200">
                                        <Eye size={15} strokeWidth={1.8} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>


                <Pagination
                    page={page}
                    totalItem={totalResult}
                    whichItem="Applications"
                    totalPages={totalPages}
                    onDecrease={() => setPage(p => p - 1)}
                    onIncrease={() => setPage(p => p + 1)}
                />
            </div>
        </div>
    )
}
