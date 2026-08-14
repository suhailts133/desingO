import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useHandleResponse = () => {
    const navigate = useNavigate();

    return (success: boolean, successMsg: string, errorMsg?: string, navigateTo?: string) => {
        if (success) {
            toast.success(successMsg);
            if (navigateTo) navigate(navigateTo);
        } else {
            toast.error( errorMsg ?? "Something went wrong");
        }
    };
};