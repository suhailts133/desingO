import type { GoogleLoginPayload } from "../authInterfaces"
import { useAuthService } from "../authService"

export const useLoginGoogle = () => {
    const { googleLogin, isGoogle } = useAuthService()
    const handleGoogleLogin = async (payload: GoogleLoginPayload) => await googleLogin(payload);
    return {
        handleGoogleLogin,
        isGoogle,
    }
}