import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../app/store";
import type { BaseQueryFn, FetchBaseQueryError, FetchArgs } from "@reduxjs/toolkit/query";
import { API_ROUTES } from "./apiRoutes";
import { logOut, setNewAccessToken } from "../app/authSlice";
import type { RefreshTokenResponse } from "./apiInterface";
import type { IApiResponse } from "./responseType";

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:3000/api",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.accessToken;
        if (token) {
            headers.set(`Authorization`, `Bearer ${token}`)
        }
        return headers
    }
})


const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, store, extraOptions) => {
    let result = await baseQuery(args, store, extraOptions)
    console.log("from the cusotm first call" , result)
    const refreshToken = (store.getState() as RootState).auth.refreshToken;
    if (result.error && result.error.status === 401) {
        if (refreshToken) {
            const refreshResult = await baseQuery(
                {
                    url: API_ROUTES.AUTH.REFRESH_TOKEN,
                    method: "POST",
                    body: { refreshToken: refreshToken }
                },
                store,
                extraOptions
            ) as { data: IApiResponse<RefreshTokenResponse> } | { error: FetchBaseQueryError }

            if ("data" in refreshResult && refreshResult.data.data) {
                console.log("new token got: ", refreshResult.data.data)
                store.dispatch(setNewAccessToken(refreshResult.data.data))

                result = await baseQuery(args, store, extraOptions);
                console.log("api call after new accesstoken" , result)
            } else {
                if("error" in refreshResult){
                    console.error("Faild to fetch new access token: ", refreshResult.error)
                    store.dispatch(logOut())
                }
            }
        } else {
            console.warn("no refresh token found logging out");
            store.dispatch(logOut())
        }
    }
    return result
}









export const baseApi = createApi({
    reducerPath: "api",
    tagTypes:["users","designerRequests", "designs", "jobs"],
    
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({})
})