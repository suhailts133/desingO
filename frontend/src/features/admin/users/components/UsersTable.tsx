import {  Eye, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import type { AdminUserManagementFilter } from "../adminUserInterface";
import { adminUserFilter } from "../../../../validations/adminValidations";
import type { AdminUsersResponseDTO } from "../adminUserInterface";
import { useNavigate } from "react-router-dom";
import { useGetAllusersQuery } from "../adminUsersEndpoints";
import { useEffect, useState } from "react";
import Pagination from "../../../../shared/common/Pagination";

export default function UsersTable() {
  const [page, setPage] = useState(1);
  const [debouncedName, setDebouncedName] = useState("");
  console.log(debouncedName)
  const { register, watch, formState: { errors } } = useForm<AdminUserManagementFilter>({
    resolver: joiResolver(adminUserFilter),
    defaultValues: { role: "All", status: "All", name: "" },
  });

  const { role, status, name } = watch();
  const { data, isLoading, error } = useGetAllusersQuery({ page, debouncedName, role, status });
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedName(name ?? "")
      setPage(1)
    }, 500);
    return () => clearTimeout(timer)
  },[name])
  
  const navigate = useNavigate();



  const users = data?.data;
  const totalUsers = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading users</p>;

  return (
    <div className="max-h-screen">
      <div className="mb-6">
        <h1 className="font-Jost-Semibold text-3xl text-soft-black">Users</h1>
        <p className="text-soft-black/50 text-sm mt-1">{totalUsers} users found</p>
      </div>

      <form>
        <div className="rounded-2xl flex items-center justify-center gap-3 mb-5 bg-white/50 p-5">
          <div className="relative w-70">
            <input type="text" className="auth-input" {...register("name")} placeholder="Enter a name" />
            <button type="button" className="absolute right-3 inset-y-0 flex items-center text-gray-500">
              <Search />
            </button>
          </div>

          <div className="w-30">
            <select className="auth-input" {...register("role")}>
              <option value="All">All</option>
              <option value="Customer">Customer</option>
              <option value="Designer">Designer</option>
            </select>
          </div>

          <div className="w-30">
            <select className="auth-input" {...register("status")}>
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>
        </div>
      </form>

      {Object.keys(errors).length > 0 && (
        <div className="mt-3 px-4 py-3 rounded-xl bg-error/10 border border-error/20">
          {errors.name && <p className="text-error text-xs">{errors.name.message}</p>}
          {errors.role && <p className="text-error text-xs">{errors.role.message}</p>}
          {errors.status && <p className="text-error text-xs">{errors.status.message}</p>}
        </div>
      )}

      {/* Table */}
      <div className="bg-white/20 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-[0_8px_32px_rgba(216,160,144,0.15)] overflow-hidden">
        <table className="w-full">
          <thead className="border-b-2 border-soft-black/20">
            <tr className="border-b border-white/25 bg-white/20 backdrop-blur-2xl">
              {["Name", "Email", "Joined", "Role", "Status", "View"].map((h) => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-Jost-Semibold text-soft-black/50 uppercase tracking-widest">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users?.map((user: AdminUsersResponseDTO, i: number) => (
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
                  <p className="text-soft-black/60 text-sm">{new Date(user.joinedAt).toLocaleDateString()}</p>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-Jost-Semibold ${user.role === "Designer" ? "bg-peach/20 text-blush-deep border border-peach/30" : "bg-blush/20 text-soft-black border border-blush/30"}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-Jost-Semibold ${!user.is_blocked ? "bg-success/10 text-success border border-success/20" : "bg-error/10 text-error border border-error/20"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${!user.is_blocked ? "bg-success" : "bg-error"}`} />
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
          onDecrease={() => setPage(p => p - 1)}
          onIncrease={() => setPage(p => p + 1)}
        />
      </div>
    </div>
  );
}