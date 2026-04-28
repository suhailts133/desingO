import { useState } from "react"
import { User, Bell, Heart, Menu, X } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../app/store"
import { logOut } from "../../app/authSlice"
import { useDecodeAccessToken } from "../../helpers/decodeAccessToken"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const toggle = () => setOpen(!open)

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)


  const isLoggedIn = !!accessToken
  const { role } = useDecodeAccessToken()
  console.log(role, "From nav")
  const handleLogout = () => {
    dispatch(logOut())
    navigate("/auth/login")
  }

  return (
    <>
      <nav className={`flex items-center justify-between ${!open ? "rounded-b-sm border border-b-gray-300" : ""}
          bg-white/30 text-soft-black p-4 backdrop-blur-3xl font-semibold
          bg-linear-to-r from-blush/30 via-blush-ligh/30t to-blush-deep/30
          `}>

        {/* Logo */}
        <div className="font-Dynalight-Regular pl-1 text-md sm:text-lg md:text-2xl">
          designO
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden sm:flex gap-3 sm:gap-5 font-Jost-Semibold sm:text-sm md:text-base">
          <span className="hover:scale-110 hover:border-b hover:transition-all cursor-pointer">
            <Link to="/designs">Designs</Link>
          </span>
          <span className="hover:scale-110 hover:border-b hover:transition-all cursor-pointer">
            <Link to="/jobs">Jobs</Link>
          </span>


          {role === "Designer" ? (
            <span className="hover:scale-110 hover:border-b hover:transition-all cursor-pointer">
              <Link to="/designer/dashboard">Dashboard</Link>
            </span>
          ) : role === "Customer" ? (
            <span className="hover:scale-110 hover:border-b hover:transition-all cursor-pointer">
              <Link to="/customer/dashboard">Dashboard</Link>
            </span>
          ) : null}

          {role === "Customer" && (
            <span className="hover:scale-110 hover:border-b hover:transition-all cursor-pointer">
              <Link to="/designer/designer-verification">
                Become a Designer
              </Link>
            </span>
          )}
          
            <span className="hover:scale-110 hover:border-b hover:transition-all cursor-pointer">
              <Link to="/designers">
                Designers
              </Link>
            </span>
          
        </div>

        <div className="flex items-center gap-2 sm:gap-3 pr-1">


          <button className="flex items-center justify-center hover:text-blush-deep transition-colors duration-200" aria-label="Liked">
            <Heart size={16} className="sm:hidden" />
            <Heart size={18} className="hidden sm:block" />
          </button>


          <button className="relative flex items-center justify-center hover:text-blush-deep transition-colors duration-200" aria-label="Notifications">
            <Bell size={16} className="sm:hidden" />
            <Bell size={18} className="hidden sm:block" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="hidden sm:flex font-Jost-Semibold text-sm md:text-base px-3 py-1 rounded-full border border-current hover:text-blush-deep hover:border-blush-deep transition-all duration-200"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/auth/login"
              className="hidden sm:flex font-Jost-Semibold text-sm md:text-base px-3 py-1 rounded-full border border-current hover:text-blush-deep hover:border-blush-deep transition-all duration-200"
            >
              Sign In
            </Link>
          )}


          <button className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200" aria-label="User profile">
            <User size={14} className="sm:hidden" />
            <User size={16} className="hidden sm:block" />
          </button>

          <button className="sm:hidden cursor-pointer" onClick={toggle}>
            <div className={`transition-transform duration-300 ${open ? "rotate-90" : "rotate-0"}`}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </div>
          </button>

        </div>
      </nav>

      {/* Mobile Dropdown */}
      <div className={`
               bg-linear-to-r from-blush/30 via-blush-ligh/30t to-blush-deep/30
        sm:hidden flex flex-col bg-white/30 text-soft-black backdrop-blur-3xl items-center
        overflow-hidden transition-all duration-300 ease-in-out
        ${open
          ? "max-h-64 py-4 gap-1 opacity-100 rounded-b-sm border border-b-gray-300 border-t-0"
          : "max-h-0 py-0 gap-0 opacity-0"
        }
      `}>

        <span className="navabr-mobile-menu">Designs</span>
        <span className="navabr-mobile-menu">Jobs</span>
        <span className="navabr-mobile-menu">Dashboard</span>
        {
          role === "Designer" ? (
            <span className="navabr-mobile-menu">
              <Link to="/designer">Dashboard</Link>
            </span>
          ) : (
            <span className="navabr-mobile-menu">
              {/* <Link to="/designer">Dashboard</Link> */}
              Dashboard
            </span>
          )
        }

        {role !== "Designer" && (
          <span className="navabr-mobile-menu">
            <Link to="/designer/designer-verification">
              Become a Designer
            </Link>
          </span>
        )}

        {/* Divider */}
        <div className="w-3/4 border-t border-soft-black my-2" />


        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="font-Jost-Semibold text-sm px-6 py-1.5 rounded-full border border-current
              hover:scale-105 hover:text-blush-deep hover:border-blush-deep transition-all duration-200"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/auth/login")}
            className="font-Jost-Semibold text-sm px-6 py-1.5 rounded-full border border-current
              hover:scale-105 hover:text-blush-deep hover:border-blush-deep transition-all duration-200"
          >
            Sign In
          </button>
        )}
      </div>
    </>
  )
}