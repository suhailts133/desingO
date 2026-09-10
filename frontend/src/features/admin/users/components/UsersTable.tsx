import { Search } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { userColumns, type AdminUserFilter, type AdminUsersResponseDTO } from "../adminUserInterface";
import { useGetAllusersQuery } from "../adminUsersEndpoints";
import Pagination from "../../../../shared/common/Pagination";
import { StatusBadge } from "../../../../shared/table/StatusBadge";
import ViewButton from "../../../../shared/table/ViewButton";
import TableHeader from "../../../../shared/table/TableHeader";
import TableBody from "../../../../shared/table/TableBody";



export default function UsersTable() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();


  const page = Number(searchParams.get("page") ?? "1");
  const role = (searchParams.get("role") as AdminUserFilter["role"]) ?? "All";
  const status = (searchParams.get("status") as AdminUserFilter["status"]) ?? "All";
  const debouncedName = searchParams.get("name") ?? "";

  const [searchInput, setSearchInput] = useState(debouncedName);


  useEffect(() => {
    setSearchInput(debouncedName);
  }, [debouncedName]);


  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== debouncedName) {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          if (searchInput.trim()) {
            next.set("name", searchInput.trim());
          } else {
            next.delete("name");
          }
          next.set("page", "1");
          return next;
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, debouncedName, setSearchParams]);


  const { data, isLoading, error } = useGetAllusersQuery({
    page,
    debouncedName: debouncedName || undefined,
    role,
    status,
  });

  const users = data?.data;
  const totalUsers = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;


  const handleFilterChange = (
    key: keyof Omit<AdminUserFilter, "debouncedName">,
    value: string
  ) => {
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
    
    role: (u: AdminUsersResponseDTO) => (
      <StatusBadge label={u.role} tone={u.role === "Designer" ? "warning" : "info"} />
    ),
    status: (u: AdminUsersResponseDTO) => (
      <StatusBadge label={u.is_blocked ? "Blocked" : "Active"} tone={u.is_blocked ? "error" : "success"} withDot />
    ),
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

      <div className="rounded-2xl flex items-center justify-center gap-3 mb-5 bg-white/50 p-5">
        <div className="relative w-70">
          <input
            type="text"
            className="auth-input"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter a name"
          />
          <span className="absolute right-3 inset-y-0 flex items-center text-gray-500 pointer-events-none">
            <Search size={18} />
          </span>
        </div>

        <div className="w-30">
          <select
            className="auth-input"
            value={role}
            onChange={(e) => handleFilterChange("role", e.target.value)}
          >
            <option value="All">All</option>
            <option value="Customer">Customer</option>
            <option value="Designer">Designer</option>
          </select>
        </div>

        <div className="w-30">
          <select
            className="auth-input"
            value={status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Table */}
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
          onDecrease={() => handlePageChange(Math.max(1, page - 1))}
          onIncrease={() => handlePageChange(Math.min(totalPages, page + 1))}
        />
      </div>
    </div >
  );
}