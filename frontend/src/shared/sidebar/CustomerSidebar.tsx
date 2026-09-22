import { useState, memo } from "react"
import {
    LayoutDashboard, User, Briefcase,
    ChevronRight, LogOut,
    Heart,
    BriefcaseBusiness
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import type { AppDispatch } from "../../app/store"
import { useDispatch } from "react-redux"
import { logOut } from "../../app/authSlice"

const CustomerSidebar = memo(({ name, email }: { name: string, email: string }) => {
    const [collapsed, setCollapsed] = useState(false)
    const [active, setActive] = useState("Dashboard")
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const handleLogout = () => {
        dispatch(logOut())
        navigate("/auth/login")
    }
    const linkClass = (label: string) => `
    group relative flex items-center gap-3 px-3 py-2.5 rounded-xl
    font-Jost-Semibold text-sm transition-all duration-200 no-underline cursor-pointer
    ${collapsed ? "justify-center" : ""}
    ${active === label
            ? "bg-accent-tint text-accent-tint-text border border-surface-border"
            : "text-text-muted hover:bg-surface-hover hover:text-text-primary"
        }
  `

    const iconClass = (label: string) =>
        `shrink-0 transition-colors duration-200 ${active === label ? "text-accent" : "text-text-faint group-hover:text-text-primary"}`
    return (
        <aside
            className={`
  
          relative flex flex-col
          bg-bg-raised
          border-r border-surface-border
            
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-20" : "w-64"}
        `}
        >

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


            <div className={`flex items-center gap-2 px-4 py-5 border-b border-surface-border ${collapsed ? "justify-center" : ""}`}>

                {!collapsed && <Link to="/" className="font-Dynalight-Regular font-semibold text-accent text-xl">designO</Link>}
            </div>


            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                {!collapsed && (
                    <p className="px-3 mb-2 text-xxs font-Jost-Semibold text-text-faint uppercase tracking-widest">
                        Main Menu
                    </p>
                )}


                <Link to="/customer/dashboard" onClick={() => setActive("Dashboard")} className={linkClass("Dashboard")}>
                    {active === "Dashboard" && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-accent" />}
                    <LayoutDashboard size={18} strokeWidth={active === "Dashboard" ? 2.2 : 1.8} className={iconClass("Dashboard")} />
                    {!collapsed && <span className="flex-1">Dashboard</span>}
                </Link>

                <Link to="/profile/customer" onClick={() => setActive("profile")} className={linkClass("profile")}>
                    {active === "profile" && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-accent" />}
                    <User size={18} strokeWidth={active === "profile" ? 2.2 : 1.8} className={iconClass("profile")} />
                    {!collapsed && <span className="flex-1">Profile</span>}
                </Link>

                {/* jobs */}
                <Link to="/customer/jobs" onClick={() => setActive("jobs")} className={linkClass("jobs")}>
                    {active === "jobs" && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-accent" />}
                    <Briefcase size={18} strokeWidth={active === "jobs" ? 2.2 : 1.8} className={iconClass("jobs")} />
                    {!collapsed && <span className="flex-1">Jobs</span>}
                </Link>


                {/* active jobs */}
                <Link to="/customer/active-jobs" onClick={() => setActive("activeJobs")} className={linkClass("activeJobs")}>
                    {active === "activeJobs" && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-accent" />}
                    <BriefcaseBusiness  size={18} strokeWidth={active === "activeJobs" ? 2.2 : 1.8} className={iconClass("activeJobs")} />
                    {!collapsed && <span className="flex-1">Active Jobs</span>}
                </Link>

                {/* my hire */}
                <Link to="/customer/my-hire" onClick={() => setActive("myHire")} className={linkClass("myHire")}>
                    {active === "myHire" && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-accent" />}
                    <BriefcaseBusiness  size={18} strokeWidth={active === "myHire" ? 2.2 : 1.8} className={iconClass("myHire")} />
                    {!collapsed && <span className="flex-1">My hires</span>}
                </Link>



                {/* savedDesign */}
                <Link to="/customer/saved-design/my" onClick={() => setActive("savedDesign")} className={linkClass("savedDesign")}>
                    {active === "savedDesign" && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-accent" />}
                    <Heart size={18} strokeWidth={active === "savedDesign" ? 2.2 : 1.8} className={iconClass("savedDesign")} />
                    {!collapsed && <span className="flex-1">Saved Design</span>}
                </Link>




            </nav>

            {/* Profile card */}
            <div className="p-3 border-t border-surface-border">
                <div className={`
            bg-surface backdrop-blur-sm border border-surface-border
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
                text-text-faint hover:bg-error-tint hover:text-error transition-colors duration-200"
                    >
                        <LogOut size={15} strokeWidth={2} />
                    </button>
                </div>
            </div>

        </aside>


    )
})

export default CustomerSidebar