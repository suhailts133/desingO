import toast from "react-hot-toast";
import { useNavigate, type NavigateOptions, type To } from "react-router-dom";

export const useHandleResponse = () => {
    const navigate = useNavigate();

    return (success: boolean, successMsg: string, errorMsg?: string, navigateTo?: To | number, navOptions?: NavigateOptions) => {
        if (success) {
            toast.success(successMsg);
            if (typeof navigateTo === "number") {
                navigate(navigateTo); 
            } else if (navigateTo) {
                navigate(navigateTo, navOptions);
            }
        } else {
            toast.error(errorMsg ?? "Something went wrong");
        }
    };
};