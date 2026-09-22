import { useNavigate } from "react-router-dom";
import { type AllDisputeAdminDTO, type DisputeAdminFilters } from "../adminDisputeInterface";
import Pagination from "../../../../shared/common/Pagination";
import { useGetAllDIsputeQuery } from "../adminDispueEndpoint";
import { StatusBadge } from "../../../../shared/table/StatusBadge";
import ViewButton from "../../../../shared/table/ViewButton";
import TableHeader from "../../../../shared/table/TableHeader";
import TableBody from "../../../../shared/table/TableBody";
import { roleTone } from "../../users/adminUserColumn";
import { disputeColumns, disputeStatusTone } from "../adminDisputeColumn";
import { useFilterParams } from "../../../../shared/filter/useFilterParams";
import { DISPUTE_FILTERS } from "../adminDisputeFilter";
import { FilterBar } from "../../../../shared/filter/FilterBar";


export default function DisputeTable() {
  const navigate = useNavigate();
  const { searchParams, getValue, setFilter, setPage } = useFilterParams({ sort: "desc" });

  const page = Number(searchParams.get("page") ?? "1");
  const status = getValue("status") as DisputeAdminFilters["status"];
  const sort = getValue("sort") as DisputeAdminFilters["sort"];

  const { data, isLoading, error } = useGetAllDIsputeQuery({
    page: String(page),
    status,
    sort,
  });

  const disputes = data?.data;
  const totalDisputes = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const cellRenderers = {
    raisedBy: (d: AllDisputeAdminDTO) => <StatusBadge label={d.raisedBy} tone={roleTone[d.raisedBy]} />,
    status: (d: AllDisputeAdminDTO) => <StatusBadge label={d.status} tone={disputeStatusTone[d.status]} />,
    view: (d: AllDisputeAdminDTO) => <ViewButton onClick={() => navigate(`/admin/disputes/${d.id}`)} />,
  };

  if (isLoading) return <p>Loading...</p>;
  if (error || !disputes) return <p>Error loading disputes</p>;

  return (
    <div className="max-h-screen">
      <div className="mb-6">
        <h1 className="font-Jost-Semibold text-3xl text-accent">Disputes</h1>
        <p className="text-text-primary text-sm mt-1">{totalDisputes} disputes found</p>
      </div>

      <FilterBar filters={DISPUTE_FILTERS} getValue={getValue} onFilterChange={setFilter} />

      <div className="bg-surface backdrop-blur-2xl border border-surface-border rounded-2xl  overflow-hidden">
        <table className="w-full">
          <TableHeader columns={disputeColumns} />
          <TableBody data={disputes} columns={disputeColumns} cellRenderers={cellRenderers} keyExtractor={(u) => u.id} />
        </table>

        <Pagination
          page={page}
          totalItem={totalDisputes}
          whichItem="disputes"
          totalPages={totalPages}
          onDecrease={() => setPage(Math.max(1, page - 1))}
          onIncrease={() => setPage(Math.min(totalPages, page + 1))}
        />
      </div>
    </div>
  );
}