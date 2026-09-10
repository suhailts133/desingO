import { Outlet } from "react-router-dom";
import Navbar from "../shared/common/Navbar";

export default function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col  bg-snow-white">
            <div className="relative z-50">
                <Navbar />
            </div>
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    )
}
