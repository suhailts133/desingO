import { useState } from "react";
import { User, Menu, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { logOut } from "../../app/authSlice";
import { useDecodeAccessToken } from "../../helpers/decodeAccessToken";
import NotificationBell from "../../features/notification/components/NotificationBell";
import ThemeToggle from "./ToggleTheme";

const navLinkClass =
  "relative py-2 text-sm font-Jost-Semibold text-text-muted transition-colors hover:text-text-primary " +
  "[&.active]:text-text-primary [&.active]:after:absolute [&.active]:after:-bottom-px [&.active]:after:left-0 " +
  "[&.active]:after:right-0 [&.active]:after:h-[2px] [&.active]:after:rounded-full [&.active]:after:bg-accent";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const isLoggedIn = !!accessToken;
  const { role, name } = useDecodeAccessToken();

  const dashboardPath =
    role === "Designer" ? "/designer/dashboard" : role === "Customer" ? "/customer/dashboard" : null;

  const handleLogout = () => {
    dispatch(logOut());
    setOpen(false);
    navigate("/auth/login");
  };
  const homePath = role === "Designer" ? "/designer/dashboard" : "/";
  return (
    <header className="sticky top-0 z-50 border-b border-surface-border bg-bg-raised/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <NavLink to={homePath} className="font-Dynalight-Regular text-xl text-accent sm:text-2xl">
          designO
        </NavLink>
        {/* Desktop links */}
        <nav className="hidden items-center gap-7 md:flex">
          <NavLink to="/designs" className={navLinkClass}>
            Designs
          </NavLink>
          <NavLink to="/jobs" className={navLinkClass}>
            Jobs
          </NavLink>
          <NavLink to="/designers" className={navLinkClass}>
            Designers
          </NavLink>
          {dashboardPath && (
            <NavLink to={dashboardPath} className={navLinkClass}>
              Dashboard
            </NavLink>
          )}
          {role === "Customer" && (
            <NavLink to="/designer/designer-verification" className={navLinkClass}>
              Become a Designer
            </NavLink>
          )}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-3">
          {isLoggedIn && <NotificationBell />}
          <ThemeToggle />
          {isLoggedIn ? (
            <>
              <button
                onClick={handleLogout}
                className="hidden rounded-full border border-surface-border-strong px-4 py-1.5 text-sm font-Jost-Semibold text-text-primary transition-colors hover:border-accent sm:block"
              >
                Log out
              </button>
              <div className="hidden h-8 w-8 items-center justify-center rounded-full bg-accent-tint text-sm font-Jost-Semibold text-accent-tint-text sm:flex">
                {name?.[0]?.toUpperCase() ?? <User size={15} />}
              </div>
            </>
          ) : (
            <NavLink
              to="/auth/login"
              className="hidden rounded-full border border-surface-border-strong px-4 py-1.5 text-sm font-Jost-Semibold text-text-primary transition-colors hover:border-accent sm:block"
            >
              Sign in
            </NavLink>
          )}

          <button
            className="flex h-8 w-8 items-center justify-center text-text-primary md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-surface-border bg-bg-raised backdrop-blur-xl transition-[max-height,opacity] duration-300 ease-in-out md:hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col divide-y divide-surface-border px-4 sm:px-6">
          <NavLink
            to="/designs"
            onClick={() => setOpen(false)}
            className="py-3.5 text-sm font-Jost-Semibold text-text-primary"
          >
            Designs
          </NavLink>
          <NavLink
            to="/jobs"
            onClick={() => setOpen(false)}
            className="py-3.5 text-sm font-Jost-Semibold text-text-primary"
          >
            Jobs
          </NavLink>
          <NavLink
            to="/designers"
            onClick={() => setOpen(false)}
            className="py-3.5 text-sm font-Jost-Semibold text-text-primary"
          >
            Designers
          </NavLink>
          {dashboardPath && (
            <NavLink
              to={dashboardPath}
              onClick={() => setOpen(false)}
              className="py-3.5 text-sm font-Jost-Semibold text-text-primary"
            >
              Dashboard
            </NavLink>
          )}
          {role === "Customer" && (
            <NavLink
              to="/designer/designer-verification"
              onClick={() => setOpen(false)}
              className="py-3.5 text-sm font-Jost-Semibold text-text-primary"
            >
              Become a Designer
            </NavLink>
          )}
        </nav>

        <div className="px-4 pb-5 pt-2 sm:px-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-Jost-Semibold text-text-muted">Theme</span>
            <ThemeToggle />
          </div>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full rounded-full border border-surface-border-strong py-2 text-sm font-Jost-Semibold text-text-primary"
            >
              Log out
            </button>
          ) : (
            <NavLink
              to="/auth/login"
              onClick={() => setOpen(false)}
              className="block w-full rounded-full border border-surface-border-strong py-2 text-center text-sm font-Jost-Semibold text-text-primary"
            >
              Sign in
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}
