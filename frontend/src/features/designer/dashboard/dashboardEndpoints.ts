import { API_ROUTES } from "../../../api/apiRoutes";
import { baseApi } from "../../../api/baseApi";
import type { IApiResponse } from "../../../api/responseType";
import type { DashboardTransactionHistory, DesignerDashboardDTO } from "./dashboardInterface";

export const designerDashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getDesignerDashboard: builder.query<IApiResponse<DesignerDashboardDTO>, void>({
            query: () => ({
                url: API_ROUTES.DASHBOARD.DESIGNER,
                method: "GET"
            })
        }),
        getMyRecentTransaction: builder.query<IApiResponse<DashboardTransactionHistory[]>, void>({
            query: () => ({
                url: API_ROUTES.DASHBOARD.RECENT_TRANSACTION,
                method: "GET"
            })
        })
    })
})


export const { useGetDesignerDashboardQuery,useGetMyRecentTransactionQuery } = designerDashboardApi