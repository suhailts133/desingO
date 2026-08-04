import { oAuth2Client } from "../../config/oAuth"
import axios from "axios";
import type { GoogleLoginResponseDTO } from "../../DTO/auth/authDTO";




export const googleLoginResponse = async (code: string): Promise<GoogleLoginResponseDTO> => {
    const { tokens } = await oAuth2Client.getToken(code);
    try {
        const userData = await axios.get(process.env.GOOGLE_API_URI as string, {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
        })
        const data = userData.data;
        return {
            email: data.email,
            full_name: data.name,
            google_profile_id: data.sub,
            profile_image_url: data.picture
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.status;
            const message = error.message
            throw new Error(`Google API error [${status}]: ${message}`, { cause: error });
        }
        throw error
    }
}