import { useParams, useNavigate, useLocation } from "react-router-dom";
import ChatPanel from "./component/ChatPanel";

export default function ChatPage() {
    const { id } = useParams();
    const location = useLocation()
    const isActive = (location.state?.isActive as boolean | undefined) ?? false
    const navigate = useNavigate();

    return (
        <ChatPanel
            isActive={isActive}
            isOpen={true}
            onClose={() => navigate(-1)}
            activeJobId={id!}
            otherPersonName="Client"
            role="Customer"
        />
    );
}