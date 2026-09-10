import { useNavigate, useSearchParams } from "react-router-dom";
import { disputeColumns, disputeStatusTone, type AllDisputeAdminDTO, type DisputeAdminFilters } from "../adminDisputeInterface";
import Pagination from "../../../../shared/common/Pagination";
import { useGetAllDIsputeQuery } from "../adminDispueEndpoint";
import { StatusBadge} from "../../../../shared/table/StatusBadge";
import ViewButton from "../../../../shared/table/ViewButton";
import TableHeader from "../../../../shared/table/TableHeader";
import TableBody from "../../../../shared/table/TableBody";
import { roleTone } from "../../users/adminUserInterface";


export default function DisputeTable() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = searchParams.get("page") ?? "1";
  const status = (searchParams.get("status") as DisputeAdminFilters["status"]) ?? "All";
  const sort = (searchParams.get("sort") as DisputeAdminFilters["sort"]) ?? "desc";
  const { data, isLoading, error } = useGetAllDIsputeQuery({
    page,
    status,
    sort,
  });

  const disputes = data?.data;
  const totalDisputes = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;


  const handleFilterChange = (key: "status" | "sort", value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set(key, value);
      next.set("page", "1");
      return next;
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(newPage));
      return next;
    });
  };

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
        <h1 className="font-Jost-Semibold text-3xl text-soft-black">Disputes</h1>
        <p className="text-soft-black/50 text-sm mt-1">{totalDisputes} disputes found</p>
      </div>

      <div className="rounded-2xl flex items-center justify-center gap-3 mb-5 bg-white/50 p-5">
        <div className="w-45">
          <select
            className="auth-input"
            value={status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="All">All statuses</option>
            <option value="Open">Open</option>
            <option value="Under Review">Under Review</option>
            <option value="Redo">Redo</option>
            <option value="Awaiting Confirmation">Awaiting Confirmation</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div className="w-30">
          <select
            className="auth-input"
            value={sort}
            onChange={(e) => handleFilterChange("sort", e.target.value)}
          >
            <option value="desc">Newest</option>
            <option value="asc">Oldest</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/20 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-[0_8px_32px_rgba(216,160,144,0.15)] overflow-hidden">
        <table className="w-full">
          <TableHeader columns={disputeColumns} />
          <TableBody data={disputes} columns={disputeColumns} cellRenderers={cellRenderers} keyExtractor={(u) => u.id} />
        </table>

        <Pagination
          page={Number(page)}
          totalItem={totalDisputes}
          whichItem="disputes"
          totalPages={totalPages}
          onDecrease={() => handlePageChange(Math.max(1, Number(page) - 1))}
          onIncrease={() => handlePageChange(Math.min(totalPages, Number(page) + 1))}
        />
      </div>
    </div>
  );
}