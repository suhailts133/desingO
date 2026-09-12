import { API_ROUTES } from "../../../api/apiRoutes";
import { baseApi } from "../../../api/baseApi";
import type { IApiResponse } from "../../../api/responseType";
import type { ReviewsLIST } from "../../proposal/proposalInterface";
import type { DashboardTransactionHistory, DesignerDashboardDTO } from "./dashboardInterface";

export const designerDashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getDesignerDashboard: builder.query<IApiResponse<DesignerDashboardDTO>, void>({
            query: () => ({
                url: API_ROUTES.DASHBOARD.DESIGNER,
                method: "GET"
            }),
            providesTags: ["designerDashboard"]

        }),
        getMyRecentTransaction: builder.query<IApiResponse<DashboardTransactionHistory[]>, void>({
            query: () => ({
                url: API_ROUTES.DASHBOARD.RECENT_TRANSACTION,
                method: "GET"
            }),
            providesTags: ["recentTransaction"]
        }),
        getTopReviews: builder.query<IApiResponse<ReviewsLIST[]>, void>({
            query: () => ({
                url: API_ROUTES.DASHBOARD.TOP_REIVEWS,
                method: "GET"
            }),
            providesTags: ["topReview"]
        }),
    })
})


export const { useGetDesignerDashboardQuery, useGetMyRecentTransactionQuery, useGetTopReviewsQuery } = designerDashboardApi