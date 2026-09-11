import { useNavigate } from "react-router-dom";
import { useGetAllDesignerRequestsQuery } from "../adminDesignerVerificationEndpoints";
import { type AdminDesignersResponseDTO } from "../adminDesignerVerificationInterfaces";
import Pagination from "../../../../shared/common/Pagination";
import { StatusBadge } from "../../../../shared/table/StatusBadge";
import ViewButton from "../../../../shared/table/ViewButton";
import TableBody from "../../../../shared/table/TableBody";
import TableHeader from "../../../../shared/table/TableHeader";
import { designerVerificationStatusTone, designerVerificationColumns } from "../adminDesignerVerificationColumn";
import { useFilterParams } from "../../../../shared/filter/useFilterParams";
import { FilterBar } from "../../../../shared/filter/FilterBar";
import { VERIFICATION_FILTERS } from "../adminDesignerVerificationFilter";

export default function DesignerVerificationTable() {
    const navigate = useNavigate();
    const { searchParams, getValue, setFilter, setPage } = useFilterParams({ name: "" });

    const page = Number(searchParams.get("page") ?? "1");
    const name = searchParams.get("name") ?? "";
    const status = getValue("status") as AdminDesignersResponseDTO["status"] | "All";

    const { data, isLoading, error } = useGetAllDesignerRequestsQuery({
        debouncedName: name || undefined,
        status,
        page,
    });

    const designerApplicationData = data?.data;
    const totalResult = data?.total ?? 0;
    const totalPages = data?.totalPages ?? 1;

    const cellRenderers = {
        status: (d: AdminDesignersResponseDTO) => (
            <StatusBadge label={d.status} tone={designerVerificationStatusTone[d.status]} />
        ),
        view: (d: AdminDesignersResponseDTO) => (
            <ViewButton onClick={() => navigate(`/admin/designer-requests/${d.id}`)} />
        ),
    };

    if (isLoading) return <p>Loading...</p>;
    if (error || !designerApplicationData) return <p>Error loading designer Requests</p>;

    return (
        <div className="min-h-screen">
            <h1 className="font-Jost-Semibold text-3xl text-soft-black">Design Verification</h1>
            <p className="text-soft-black/50 text-sm mt-1">{totalResult} Designer Requests found</p>

            <FilterBar filters={VERIFICATION_FILTERS} getValue={getValue} onFilterChange={setFilter} />

            <div className="bg-white/20 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-[0_8px_32px_rgba(216,160,144,0.15)] overflow-hidden">
                <table className="w-full">
                    <TableHeader columns={designerVerificationColumns} />
                    <TableBody
                        data={designerApplicationData}
                        columns={designerVerificationColumns}
                        cellRenderers={cellRenderers}
                        keyExtractor={(u) => u.id}
                    />
                </table>

                <Pagination
                    page={page}
                    totalItem={totalResult}
                    whichItem="Applications"
                    totalPages={totalPages}
                    onDecrease={() => setPage(Math.max(1, page - 1))}
                    onIncrease={() => setPage(Math.min(totalPages, page + 1))}
                />
            </div>
        </div>
    );
}