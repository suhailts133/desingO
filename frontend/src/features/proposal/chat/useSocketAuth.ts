import { useSelector, useDispatch } from "react-redux"
import { jwtDecode } from "jwt-decode"
import axios from "axios"
import type { RootState } from "../../../app/store"
import { setNewAccessToken, logOut } from "../../../app/authSlice"
import { API_ROUTES } from "../../../api/apiRoutes"
import type { IApiResponse } from "../../../api/responseType"
import type { JwtAccessTokenPayload, RefreshTokenResponse } from "../../../api/apiInterface"



export function useSocketAuth() {
    const token = useSelector((state: RootState) => state.auth.accessToken)
    const refreshToken = useSelector((state: RootState) => state.auth.refreshToken)
    const dispatch = useDispatch()

    const getNewToken = async (): Promise<string | null> => {
        try {
            if (token) {
                const decoded = jwtDecode<JwtAccessTokenPayload>(token)
                const now = Math.floor(Date.now() / 1000)
                if (decoded.exp - now >= 60) return token
            }

            if (!refreshToken) {
                dispatch(logOut())
                return null
            }

            const response = await axios.post<IApiResponse<RefreshTokenResponse>>(
                `${import.meta.env.VITE_API_URL}${API_ROUTES.AUTH.REFRESH_TOKEN}`,
                { refreshToken }
            )
            console.log(response.data)

            if (response.data.data) {
                dispatch(setNewAccessToken(response.data.data))
                return response.data.data.newAccessToken
            }

            dispatch(logOut())
            return null
        } catch {
            dispatch(logOut())
            return null
        }
    }

    return { getNewToken, token, refreshToken }
}