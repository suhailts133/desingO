import { useNavigate } from "react-router-dom";
import { type AdminUsersResponseDTO } from "../adminUserInterface";
import { useGetAllusersQuery } from "../adminUsersEndpoints";
import Pagination from "../../../../shared/common/Pagination";
import { StatusBadge } from "../../../../shared/table/StatusBadge";
import ViewButton from "../../../../shared/table/ViewButton";
import TableHeader from "../../../../shared/table/TableHeader";
import TableBody from "../../../../shared/table/TableBody";
import { useFilterParams } from "../../../../shared/filter/useFilterParams";
import { FilterBar } from "../../../../shared/filter/FilterBar";
import { USER_FILTERS } from "../adminUserFilter";
import { userColumns } from "../adminUserColumn";


export default function UsersTable() {
  const navigate = useNavigate();
  const { searchParams, getValue, setFilter, setPage } = useFilterParams();

  const page = Number(searchParams.get("page") ?? "1");
  const role = getValue("role") as "All" | "Customer" | "Designer";
  const status = getValue("status") as "All" | "Active" | "Blocked";
  const name = searchParams.get("name") ?? "";

  const { data, isLoading, error } = useGetAllusersQuery({
    page,
    debouncedName: name || undefined,
    role,
    status,
  });

  const users = data?.data;
  const totalUsers = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const cellRenderers = {
    role: (u: AdminUsersResponseDTO) => <StatusBadge label={u.role} tone={u.role === "Designer" ? "warning" : "info"} />,
    status: (u: AdminUsersResponseDTO) => <StatusBadge label={u.is_blocked ? "Blocked" : "Active"} tone={u.is_blocked ? "error" : "success"} withDot />,
    view: (u: AdminUsersResponseDTO) => <ViewButton onClick={() => navigate(`/admin/users/${u.id}`)} />,
  };

  if (isLoading) return <p>Loading...</p>;
  if (error || !users) return <p>Error loading users</p>;

  return (
    <div className="max-h-screen">
      <div className="mb-6">
        <h1 className="font-Jost-Semibold text-3xl text-soft-black">Users</h1>
        <p className="text-soft-black/50 text-sm mt-1">{totalUsers} users found</p>
      </div>

      <FilterBar filters={USER_FILTERS} getValue={getValue} onFilterChange={setFilter} />

      <div className="bg-white/20 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-[0_8px_32px_rgba(216,160,144,0.15)] overflow-hidden">
        <table className="w-full">
          <TableHeader columns={userColumns} />
          <TableBody data={users} columns={userColumns} cellRenderers={cellRenderers} keyExtractor={(u) => u.id} />
        </table>

        <Pagination
          page={page}
          totalItem={totalUsers}
          whichItem="users"
          totalPages={totalPages}
          onDecrease={() => setPage(Math.max(1, page - 1))}
          onIncrease={() => setPage(Math.min(totalPages, page + 1))}
        />
      </div>
    </div>
  );
}