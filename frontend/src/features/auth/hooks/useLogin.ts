import { useAuthService } from "../authService"
import type { LoginPayload } from "../authInterfaces";

export const useLogin = () => {
    const { login, isLogging } = useAuthService();

    const handleLogin = async (data: LoginPayload) => await login(data)
    return {
        handleLogin,
        isLoading: isLogging,
        
    }
}