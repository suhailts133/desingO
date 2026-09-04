import { Outlet } from "react-router-dom";
import Navbar from "../shared/common/Navbar";
import AIDesignButton from "../features/aiDesign/components/AIDesignButton";
import AIDesignChatPanel from "../features/aiDesign/components/AIDesignChatPanel";

export default function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-snow-white">
            <Navbar />
            <main className="flex-1">
                <Outlet/>
            </main>
            <AIDesignButton />
            <AIDesignChatPanel />
        </div>
    )
}