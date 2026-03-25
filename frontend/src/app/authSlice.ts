import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "../features/auth/authInterfaces";
import type { JwtResponse, RefreshTokenResponse } from "../api/apiInterface";

const initialState: AuthState = {
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
    isAuthenticated: !!localStorage.getItem("accessToken")
}


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<JwtResponse>) => {

            state.accessToken = action.payload.jwtToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = true;
            localStorage.setItem("accessToken", action.payload.jwtToken);
            localStorage.setItem("refreshToken", action.payload.refreshToken);
        },

        setNewAccessToken: (state, action: PayloadAction<RefreshTokenResponse>) => {
            console.log("from auth slice: ", action.payload.newAccessToken)
            state.accessToken = action.payload.newAccessToken
            localStorage.setItem("accessToken", action.payload.newAccessToken);
        },

        logOut: (state) => {
            state.accessToken = null;
            state.isAuthenticated = false;
            state.refreshToken = null
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        }

    }
})


export const { setCredentials, logOut,setNewAccessToken } = authSlice.actions
export default authSlice.reducer