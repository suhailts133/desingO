import toast from "react-hot-toast";
import { useNavigate, type NavigateOptions } from "react-router-dom";

export const useHandleResponse = () => {
    const navigate = useNavigate();

    return (success: boolean, successMsg: string, errorMsg?: string, navigateTo?: string, navOptions?: NavigateOptions) => {
        if (success) {
            toast.success(successMsg);
            if (navigateTo) {
                navigate(navigateTo, navOptions);
            }

        } else {
            toast.error(errorMsg ?? "Something went wrong");
        }
    };
};