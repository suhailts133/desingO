import { useParams, useNavigate } from "react-router-dom";
import ChatPanel from "./component/ChatPanel";

export default function ChatPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <ChatPanel
            isOpen={true}
            onClose={() => navigate(-1)}
            activeJobId={id!}
            otherPersonName="Client"
            role="Customer"
        />
    );
}