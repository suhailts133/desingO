import { useState, memo } from "react";
import {
  LayoutDashboard,
  User,
  Briefcase,
  ChevronRight,
  LogOut,
  Heart,
  BriefcaseBusiness,
  ArrowLeftRight,
  Search,
  House,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../app/store";
import { useDispatch } from "react-redux";
import { logOut } from "../../app/authSlice";

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const sections: NavSection[] = [
  {
    title: "Main Menu",
    items: [
      { to: "/customer/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/profile/customer", label: "Profile", icon: User },
      { to: "/customer/jobs", label: "My Jobs", icon: Briefcase },
      {
        to: "/customer/active-jobs",
        label: "Active Jobs",
        icon: BriefcaseBusiness,
      },
      { to: "/customer/my-hire", label: "My hires", icon: BriefcaseBusiness },
      { to: "/customer/saved-design/my", label: "Saved Design", icon: Heart },
      {
        to: "/customer/transaction",
        label: "Transactions",
        icon: ArrowLeftRight,
      },
    ],
  },
  {
    title: "Browse",
    items: [
      { to: "/designs", label: "Browse Designs", icon: House },
      { to: "/designers", label: "Browse Designers", icon: Users },
      { to: "/jobs", label: "Browse Jobs", icon: Search },
    ],
  },
];

const CustomerSidebar = memo(({ name, email }: { name: string; email: string }) => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/auth/login");
  };

  const linkClass = (isActive: boolean) => `
    group relative flex items-center gap-3 px-3 py-2.5 rounded-xl
    font-Jost-Semibold text-sm transition-all duration-200 no-underline cursor-pointer
    ${collapsed ? "justify-center" : ""}
    ${
      isActive
        ? "bg-accent-tint text-accent-tint-text border border-surface-border"
        : "text-text-muted hover:bg-surface-hover hover:text-text-primary"
    }
  `;

  const iconClass = (isActive: boolean) =>
    `shrink-0 transition-colors duration-200 ${
      isActive ? "text-accent" : "text-text-faint group-hover:text-text-primary"
    }`;

  return (
    <aside
      className={`relative flex flex-col bg-bg-raised border-r border-surface-border transition-all duration-300 ease-in-out ${collapsed ? "w-20" : "w-64"}`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3.5 top-6 z-10 flex items-center justify-center
            w-7 h-7 rounded-full bg-accent border border-accent text-text-on-accent
            hover:bg-accent-hover transition-colors duration-200"
      >
        <ChevronRight
          size={14}
          strokeWidth={2.5}
          className={`transition-transform duration-300 ${collapsed ? "" : "rotate-180"}`}
        />
      </button>

      <div
        className={`flex items-center gap-2 px-4 py-5 border-b border-surface-border ${collapsed ? "justify-center" : ""}`}
      >
        <Link to="/customer/dashboard" className="font-Dynalight-Regular font-semibold text-accent text-xl">
          {collapsed ? "d" : "designO"}
        </Link>
      </div>

      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        {sections.map((section, i) => (
          <div key={section.title} className={i > 0 ? "mt-5" : ""}>
            {collapsed ? (
              i > 0 && <div className="mx-3 mb-3 border-t border-surface-border" />
            ) : (
              <p className="px-3 mb-2 text-xxs font-Jost-Semibold text-text-faint uppercase tracking-widest">
                {section.title}
              </p>
            )}

            <div className="space-y-1">
              {section.items.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  title={collapsed ? label : undefined}
                  className={({ isActive }) => linkClass(isActive)}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-accent" />
                      )}
                      <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} className={iconClass(isActive)} />
                      {!collapsed && <span className="flex-1">{label}</span>}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Profile card */}
      <div className="p-3 border-t border-surface-border">
        <div
          className={`
            bg-surface backdrop-blur-sm border border-surface-border
            rounded-xl px-3 py-2.5 flex items-center gap-3
            ${collapsed ? "flex-col justify-center gap-2" : ""}
          `}
        >
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-Jost-Semibold text-text-primary text-sm truncate leading-tight">{name}</p>
              <p className="text-text-faint text-xs truncate leading-tight">{email}</p>
            </div>
          )}

          <button
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
            className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0
                text-error hover:bg-error-tint hover:text-error-text transition-colors duration-200"
          >
            <LogOut size={15} strokeWidth={2} />
          </button>
        </div>
      </div>
    </aside>
  );
});

export default CustomerSidebar;
