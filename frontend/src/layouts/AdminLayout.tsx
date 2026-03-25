import { Outlet, Navigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../app/store";
import AdminSidebar from "../shared/AdminSidebar";
import { useSelector, useDispatch } from "react-redux";
import { useDecodeAccessToken } from "../helpers/decodeAccessToken";
import { logOut } from "../app/authSlice";
import { useEffect } from "react";

export default function AdminLayout() {
  const dispatch = useDispatch<AppDispatch>();

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const { name, email } = useDecodeAccessToken();

  useEffect(() => {
    if (!name && !email) {
      dispatch(logOut());
    }
  }, [name, email]);


  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/auth/admin-login" />;
  }

  if (!name && !email) {
    return <Navigate to="/auth/admin-login" />;
  }

  return (
    <div className="fixed inset-0 flex bg-seashell-tint overflow-hidden">
      <AdminSidebar name={name} email={email} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}