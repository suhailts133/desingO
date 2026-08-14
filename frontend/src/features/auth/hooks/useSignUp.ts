import { useAuthService } from "../authService";
import type { SignUpPayload } from "../authInterfaces";

export const useSignUp = () => {

    const {signUp,isSigningUp} = useAuthService();
    
    const handleSignUp = async (data:SignUpPayload) => await signUp(data);
      
    return {
        handleSignUp,
        isLoading:isSigningUp,
        
    }
}