import { useState, memo } from "react"
import {
  LayoutDashboard, Users, Briefcase,
  CircleDollarSign, Star, ChevronRight, LogOut,
  UserCheck, TriangleAlert
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import type { AppDispatch } from "../../app/store"
import { useDispatch } from "react-redux"
import { logOut } from "../../app/authSlice"
const AdminSidebar = memo(({ name, email }: { name: string, email: string }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [active, setActive] = useState("Dashboard")
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const handleLogout = () => {
    dispatch(logOut())
    navigate("/auth/admin-login")
  }
  const linkClass = (label: string) => `
    group relative flex items-center gap-3 px-3 py-2.5 rounded-xl
    font-Jost-Semibold text-sm transition-all duration-200 no-underline cursor-pointer
    ${collapsed ? "justify-center" : ""}
    ${active === label
      ? "bg-accent-tint text-accent-tint-text border border-surface-border-strong"
      : "text-text-muted hover:bg-surface-hover hover:text-text-primary"
    }
  `

  const iconClass = (label: string) =>
    `shrink-0 transition-colors duration-200 ${active === label ? "text-accent" : "text-text-faint group-hover:text-text-primary"}`

  return (
    <aside
      className={`
  
          relative flex flex-col
          bg-surface
          border-r border-surface-border
            
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-20" : "w-64"}
        `}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-6 z-10 flex items-center justify-center
            w-7 h-7 rounded-full bg-accent border border-accent text-text-on-accent
            hover:bg-accent-hover transition-colors duration-200"
      >
        <ChevronRight
          size={14} strokeWidth={2.5}
          className={`transition-transform duration-300 ${collapsed ? "" : "rotate-180"}`}
        />
      </button>

      {/* Logo */}
      <div className={`flex items-center gap-2 px-4 py-5 border-b border-surface-border ${collapsed ? "justify-center" : ""}`}>

        {!collapsed && <span className="font-Dynalight-Regular font-semibold text-accent text-xl">designO</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 mb-2 text-xxs font-Jost-Semibold text-text-faint uppercase tracking-widest">
            Main Menu
          </p>
        )}

        {/* Dashboard */}
        <Link to="/admin/dashboard" onClick={() => setActive("Dashboard")} className={linkClass("Dashboard")}>
          {active === "Dashboard" && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-accent" />}
          <LayoutDashboard size={18} strokeWidth={active === "Dashboard" ? 2.2 : 1.8} className={iconClass("Dashboard")} />
          {!collapsed && <span className="flex-1">Dashboard</span>}
        </Link>

        {/* Users */}
        <Link to="/admin/users" onClick={() => setActive("Users")} className={linkClass("Users")}>
          {active === "Users" && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-accent" />}
          <Users size={18} strokeWidth={active === "Users" ? 2.2 : 1.8} className={iconClass("Users")} />
          {!collapsed && <span className="flex-1">Users</span>}
        </Link>

        {/* designer verifcation */}
        <Link to="/admin/designer-requests" onClick={() => setActive("Products")} className={linkClass("Products")}>
          {active === "Products" && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-accent" />}
          <UserCheck size={18} strokeWidth={active === "Products" ? 2.2 : 1.8} className={iconClass("Products")} />
          {!collapsed && <span className="flex-1">Designer Verification</span>}
        </Link>

        {/* disputes */}
        <Link to="/admin/disputes" onClick={() => setActive("disputes")} className={linkClass("disputes")}>
          {active === "Orders" && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-accent" />}
          <TriangleAlert size={18} strokeWidth={active === "disputes" ? 2.2 : 1.8} className={iconClass("disputes")} />
          {!collapsed && <span className="flex-1">Disputes</span>}
        </Link>

        {/* transaction */}
   <Link to="/admin/transaction" onClick={() => setActive("transaction")} className={linkClass("transaction")}>
          {active === "Analytics" && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-accent" />}
          <CircleDollarSign size={18} strokeWidth={active === "Analytics" ? 2.2 : 1.8} className={iconClass("Analytics")} />
          {!collapsed && <span className="flex-1">transaction</span>}
           </Link>


        {/* Jobs */}
        <a onClick={() => setActive("Notifications")} className={linkClass("Notifications")}>
          {active === "Notifications" && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-accent" />}
          <Briefcase size={18} strokeWidth={active === "Notifications" ? 2.2 : 1.8} className={iconClass("Notifications")} />
          {!collapsed && <span className="flex-1">Jobs</span>}
        </a>

        {/* reviews */}
        <a onClick={() => setActive("reivews")} className={linkClass("reivews")}>
          {active === "reivews" && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-accent" />}
          <Star size={18} strokeWidth={active === "Settings" ? 2.2 : 1.8} className={iconClass("reivews")} />
          {!collapsed && <span className="flex-1">Reviews</span>}
        </a>


      </nav>

      {/* Profile card */}
      <div className="p-3 border-t border-surface-border">
        <div className={`
            bg-surface-hover backdrop-blur-sm border border-surface-border
            rounded-xl px-3 py-2.5 flex items-center gap-3
            ${collapsed ? "flex-col justify-center gap-2" : ""}
          `}>


          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-Jost-Semibold text-text-primary text-sm truncate leading-tight">{name}</p>
              <p className="text-text-faint text-xs truncate leading-tight">{email}</p>
            </div>
          )}

          <button
            onClick={() => handleLogout()}
            title="Logout"
            className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0
                text-text-faint hover:bg-error/10 hover:text-error transition-colors duration-200"
          >
            <LogOut size={15} strokeWidth={2} />
          </button>
        </div>
      </div>

    </aside>


  )
})

export default AdminSidebar