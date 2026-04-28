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
      ? "bg-linear-to-r from-blush/40 to-blush-light/20 text-blush-deep border border-blush-light/50"
      : "text-soft-black/70 hover:bg-blush-pale/60 hover:text-soft-black"
    }
  `

  const iconClass = (label: string) =>
    `shrink-0 transition-colors duration-200 ${active === label ? "text-blush-deep" : "text-soft-black/50 group-hover:text-soft-black"}`

  return (
    <aside
      className={`
  
          relative flex flex-col
          bg-linear-to-b from-blush-pale via-off-white to-linen-rose
          border-r border-blush-light/60
            
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-20" : "w-64"}
        `}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-6 z-10 flex items-center justify-center
            w-7 h-7 rounded-full bg-blush border border-blush-light text-white shadow-md
            hover:bg-blush-deep transition-colors duration-200"
      >
        <ChevronRight
          size={14} strokeWidth={2.5}
          className={`transition-transform duration-300 ${collapsed ? "" : "rotate-180"}`}
        />
      </button>

      {/* Logo */}
      <div className={`flex items-center gap-2 px-4 py-5 border-b border-blush-light/50 ${collapsed ? "justify-center" : ""}`}>

        {!collapsed && <span className="font-Dynalight-Regular font-semibold text-soft-black text-xl">designO</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 mb-2 text-xxs font-Jost-Semibold text-soft-black/40 uppercase tracking-widest">
            Main Menu
          </p>
        )}

        {/* Dashboard */}
        <Link to="/admin/dashboard" onClick={() => setActive("Dashboard")} className={linkClass("Dashboard")}>
          {active === "Dashboard" && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-blush-deep" />}
          <LayoutDashboard size={18} strokeWidth={active === "Dashboard" ? 2.2 : 1.8} className={iconClass("Dashboard")} />
          {!collapsed && <span className="flex-1">Dashboard</span>}
        </Link>

        {/* Users */}
        <Link to="/admin/users" onClick={() => setActive("Users")} className={linkClass("Users")}>
          {active === "Users" && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-blush-deep" />}
          <Users size={18} strokeWidth={active === "Users" ? 2.2 : 1.8} className={iconClass("Users")} />
          {!collapsed && <span className="flex-1">Users</span>}
        </Link>

        {/* designer verifcation */}
        <Link to="/admin/designer-requests" onClick={() => setActive("Products")} className={linkClass("Products")}>
          {active === "Products" && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-blush-deep" />}
          <UserCheck size={18} strokeWidth={active === "Products" ? 2.2 : 1.8} className={iconClass("Products")} />
          {!collapsed && <span className="flex-1">Designer Verification</span>}
        </Link>

        {/* disputes */}
        <a onClick={() => setActive("Orders")} className={linkClass("Orders")}>
          {active === "Orders" && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-blush-deep" />}
          <TriangleAlert size={18} strokeWidth={active === "Orders" ? 2.2 : 1.8} className={iconClass("Orders")} />
          {!collapsed && <span className="flex-1">Disputes</span>}
        </a>

        {/* bids */}
        <a onClick={() => setActive("Analytics")} className={linkClass("Analytics")}>
          {active === "Analytics" && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-blush-deep" />}
          <CircleDollarSign size={18} strokeWidth={active === "Analytics" ? 2.2 : 1.8} className={iconClass("Analytics")} />
          {!collapsed && <span className="flex-1">Bids</span>}
        </a>

        {/* Jobs */}
        <a onClick={() => setActive("Notifications")} className={linkClass("Notifications")}>
          {active === "Notifications" && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-blush-deep" />}
          <Briefcase size={18} strokeWidth={active === "Notifications" ? 2.2 : 1.8} className={iconClass("Notifications")} />
          {!collapsed && <span className="flex-1">Jobs</span>}
        </a>

        {/* reviews */}
        <a onClick={() => setActive("reivews")} className={linkClass("reivews")}>
          {active === "reivews" && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-blush-deep" />}
          <Star size={18} strokeWidth={active === "Settings" ? 2.2 : 1.8} className={iconClass("reivews")} />
          {!collapsed && <span className="flex-1">Reviews</span>}
        </a>


      </nav>

      {/* Profile card */}
      <div className="p-3 border-t border-blush-light/50">
        <div className={`
            bg-white/60 backdrop-blur-sm border border-blush-light/60
            rounded-xl px-3 py-2.5 shadow-sm flex items-center gap-3
            ${collapsed ? "flex-col justify-center gap-2" : ""}
          `}>


          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-Jost-Semibold text-soft-black text-sm truncate leading-tight">{name}</p>
              <p className="text-soft-black/50 text-xs truncate leading-tight">{email}</p>
            </div>
          )}

          <button
            onClick={() => handleLogout()}
            title="Logout"
            className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0
                text-soft-black/40 hover:bg-error/10 hover:text-error transition-colors duration-200"
          >
            <LogOut size={15} strokeWidth={2} />
          </button>
        </div>
      </div>

    </aside>


  )
})

export default AdminSidebar