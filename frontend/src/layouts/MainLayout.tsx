import { Outlet } from "react-router-dom";
import Navbar from "../shared/Navbar";

export default function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col  bg-snow-white">
            <Navbar />
            <main className="flex-1">
                <Outlet/>
            </main>
        </div>
    )
}
