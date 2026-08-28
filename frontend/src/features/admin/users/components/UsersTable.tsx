import { Eye, Search } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { AdminUserFilter, AdminUsersResponseDTO } from "../adminUserInterface";
import { useGetAllusersQuery } from "../adminUsersEndpoints";
import Pagination from "../../../../shared/common/Pagination";

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
          <thead className="border-b-2 border-soft-black/20">
            <tr className="border-b border-white/25 bg-white/20 backdrop-blur-2xl">
              {["Name", "Email", "Joined", "Role", "Status", "View"].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3.5 text-xs font-Jost-Semibold text-soft-black/50 uppercase tracking-widest"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user: AdminUsersResponseDTO, i: number) => (
              <tr
                key={user.id}
                className={`${i % 2 === 0 ? "bg-white/50" : ""} transition-colors duration-150 hover:bg-white/20 ${i !== users.length - 1 ? "border-b border-white/20" : ""}`}
              >
                <td className="px-5 py-3.5">
                  <p className="font-Jost-Semibold text-soft-black text-sm">{user.full_name}</p>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-soft-black/60 text-sm">{user.email}</p>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-soft-black/60 text-sm">
                    {new Date(user.joinedAt).toLocaleDateString()}
                  </p>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-Jost-Semibold ${
                      user.role === "Designer"
                        ? "bg-peach/20 text-blush-deep border border-peach/30"
                        : "bg-blush/20 text-soft-black border border-blush/30"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-Jost-Semibold ${
                      !user.is_blocked
                        ? "bg-success/10 text-success border border-success/20"
                        : "bg-error/10 text-error border border-error/20"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${!user.is_blocked ? "bg-success" : "bg-error"}`}
                    />
                    {!user.is_blocked ? "Active" : "Blocked"}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => navigate(`/admin/users/${user.id}`)}
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
          totalItem={totalUsers}
          whichItem="users"
          totalPages={totalPages}
          onDecrease={() => handlePageChange(Math.max(1, page - 1))}
          onIncrease={() => handlePageChange(Math.min(totalPages, page + 1))}
        />
      </div>
    </div>
  );
}