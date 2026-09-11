import { API_ROUTES } from "../../../api/apiRoutes";
import { baseApi } from "../../../api/baseApi";
import type { IApiResponse } from "../../../api/responseType";
import type { AdminDashboardDTO } from "./adminDashboardInterface";

export const adminDisputesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAdminDashboard: builder.query<IApiResponse<AdminDashboardDTO>, void>({
            query: () => ({
                url: API_ROUTES.DASHBOARD.ADMIN
            })
        })
    })
})


export const {
    useGetAdminDashboardQuery
} = adminDisputesApi