import { Search } from "lucide-react";
import { useGetAllDesignerRequestsQuery } from "../adminDesignerVerificationEndpoints"
import { designerVerificationColumns, designerVerificationStatusTone, type AdminDesignersResponseDTO } from "../adminDesignerVerificationInterfaces";
import { useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import type { AdminDesignerVerificationFilter } from "../../users/adminUserInterface";
import { joiResolver } from "@hookform/resolvers/joi";
import { adminDesignerVerificationFilter } from "../../../../validations/adminValidations";
import { useEffect, useState } from "react";
import Pagination from "../../../../shared/common/Pagination";
import { StatusBadge } from "../../../../shared/table/StatusBadge";
import ViewButton from "../../../../shared/table/ViewButton";
import TableBody from "../../../../shared/table/TableBody";
import TableHeader from "../../../../shared/table/TableHeader";





export default function DesignerVerificationTable() {
    const [page, setPage] = useState(1);
    const [debouncedName, setDebouncedName] = useState("");

    const { register, control, formState: { errors } } = useForm<AdminDesignerVerificationFilter>({
        resolver: joiResolver(adminDesignerVerificationFilter),
        defaultValues: { name: "", status: "All" }
    })
    const name = useWatch({ control, name: "name" })
    const status = useWatch({ control, name: "status" })

    const { data, isLoading, error } = useGetAllDesignerRequestsQuery({ debouncedName, status, page });
    const navigate = useNavigate()
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedName(name ?? "")
            setPage(1)
        }, 500);
        return () => clearTimeout(timer)
    }, [name])



    const designerApplicationData = data?.data;
    const totalResult = data?.total ?? 0;
    const totalPages = data?.totalPages ?? 1

    const cellRenderers = {
        status: (d: AdminDesignersResponseDTO) => <StatusBadge label={d.status} tone={designerVerificationStatusTone[d.status]} />,
        view: (d: AdminDesignersResponseDTO) => <ViewButton onClick={() => navigate(`/admin/designer-requests/${d.id}`)} />,
    };
    if (isLoading) return <p>Loading...</p>;
    if (error || !designerApplicationData) return <p>Error loading designer Requests</p>;
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
                    <TableHeader columns={designerVerificationColumns} />
                    <TableBody data={designerApplicationData} columns={designerVerificationColumns} cellRenderers={cellRenderers} keyExtractor={(u) => u.id} />
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
