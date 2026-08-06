import { Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { AllDisputeAdminDTO, DisputeAdminFilters } from "../adminDisputeInterface";

import Pagination from "../../../../shared/common/Pagination";
import { useGetAllDIsputeQuery } from "../adminDispueEndpoint";

const disputeStatusStyle: Record<AllDisputeAdminDTO["status"], string> = {
  "Open": "bg-error/10 text-error border-error/20",
  "Under Review": "bg-blue-50 text-blue-700 border-blue-200",
  "Resolved": "bg-success/10 text-success border-success/20",
  "Redo": "bg-amber-50 text-amber-700 border-amber-200",
  "Awaiting Confirmation": "bg-purple-50 text-purple-700 border-purple-200",
}

export default function DisputeTable() {
  const [page, setPage] = useState(1);

  const { register, watch } = useForm<Pick<DisputeAdminFilters, "status" | "sort">>({
    defaultValues: { status: "All", sort: "desc" },
  });

  const { status, sort } = watch();

  useEffect(() => {
    setPage(1);
  }, [status, sort]);

  const { data, isLoading, error } = useGetAllDIsputeQuery({
    page: String(page),
    status,
    sort,
  });

  const navigate = useNavigate();

  const disputes = data?.data;
  const totalDisputes = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  if (isLoading) return <p>Loading...</p>;
  if (error || !disputes) return <p>Error loading disputes</p>;

  return (
    <div className="max-h-screen">
      <div className="mb-6">
        <h1 className="font-Jost-Semibold text-3xl text-soft-black">Disputes</h1>
        <p className="text-soft-black/50 text-sm mt-1">{totalDisputes} disputes found</p>
      </div>

      <form>
        <div className="rounded-2xl flex items-center justify-center gap-3 mb-5 bg-white/50 p-5">
          <div className="w-45">
            <select className="auth-input" {...register("status")}>
              <option value="All">All statuses</option>
              <option value="Open">Open</option>
              <option value="Under Review">Under Review</option>
              <option value="Redo">Redo</option>
              <option value="Awaiting Confirmation">Awaiting Confirmation</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="w-30">
            <select className="auth-input" {...register("sort")}>
              <option value="desc">Newest</option>
              <option value="asc">Oldest</option>
            </select>
          </div>
        </div>
      </form>

      {/* Table */}
      <div className="bg-white/20 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-[0_8px_32px_rgba(216,160,144,0.15)] overflow-hidden">
        <table className="w-full">
          <thead className="border-b-2 border-soft-black/20">
            <tr className="border-b border-white/25 bg-white/20 backdrop-blur-2xl">
              {["Type", "Reason", "Raised By", "Status", "Created", "View"].map((h) => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-Jost-Semibold text-soft-black/50 uppercase tracking-widest">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {disputes?.map((dispute: AllDisputeAdminDTO, i: number) => (
              <tr
                key={dispute.id}
                className={`${i % 2 === 0 ? "bg-white/50" : ""} transition-colors duration-150 hover:bg-white/20 ${i !== disputes.length - 1 ? "border-b border-white/20" : ""}`}
              >
                <td className="px-5 py-3.5">
                  <p className="font-Jost-Semibold text-soft-black text-sm">{dispute.type}</p>
                </td>
                <td className="px-5 py-3.5 max-w-xs">
                  <p className="text-soft-black/60 text-sm truncate">{dispute.reason}</p>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-Jost-Semibold ${dispute.raisedBy === "Designer" ? "bg-peach/20 text-blush-deep border border-peach/30" : "bg-blush/20 text-soft-black border border-blush/30"}`}>
                    {dispute.raisedBy}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-Jost-Semibold border ${disputeStatusStyle[dispute.status]}`}>
                    {dispute.status}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-soft-black/60 text-sm">{new Date(dispute.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => navigate(`/admin/disputes/${dispute.id}`)}
                    className="hover:cursor-pointer flex items-center justify-center w-8 h-8 rounded-lg bg-white/30 backdrop-blur-sm border border-white/40 text-soft-black/60 hover:text-blush-deep hover:bg-white/60 transition-all duration-200"
                  >
                    <Eye size={15} strokeWidth={1.8} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          page={page}
          totalItem={totalDisputes}
          whichItem="disputes"
          totalPages={totalPages}
          onDecrease={() => setPage(p => p - 1)}
          onIncrease={() => setPage(p => p + 1)}
        />
      </div>
    </div>
  );
}