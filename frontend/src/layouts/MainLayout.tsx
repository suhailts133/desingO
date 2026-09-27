import { Outlet } from "react-router-dom";
import Navbar from "../shared/common/Navbar";
import AIDesignButton from "../features/aiDesign/components/AIDesignButton";
import AIDesignChatPanel from "../features/aiDesign/components/AIDesignChatPanel";
// import MeshBackdrop from "../shared/common/MeshBackDrop";

export default function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-bg">
            <div className="relative z-50">
                <Navbar />
            </div>
            <main className="relative z-0 flex-1 overflow-hidden">
                {/* <MeshBackdrop /> */}
                <Outlet />
            </main>
            <AIDesignButton />
            <AIDesignChatPanel />
        </div>
    )
}