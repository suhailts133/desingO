import { useAuthService } from "../authService"
import type { LoginPayload } from "../authInterfaces";

export const useAdminLogin = () => {
    const { adminLogin, isAdminLogging } = useAuthService();

    const handleAdminLogin = async (data: LoginPayload) => await adminLogin(data)

    return {
        handleAdminLogin,
        isLoading: isAdminLogging,

    }
}