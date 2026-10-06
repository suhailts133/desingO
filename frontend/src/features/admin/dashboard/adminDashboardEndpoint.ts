import { API_ROUTES } from "../../../api/apiRoutes";
import { baseApi } from "../../../api/baseApi";
import type { IApiResponse } from "../../../api/responseType";
import type { AdminDashboardDTO, DisputeReportDTO, JobReportDTO } from "./adminDashboardInterface";

export const adminDisputesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAdminDashboard: builder.query<IApiResponse<AdminDashboardDTO>, void>({
            query: () => ({
                url: API_ROUTES.DASHBOARD.ADMIN
            })
        }),
        getJobReport:builder.query<IApiResponse<JobReportDTO>,void>({
            query:() => ({
                url:API_ROUTES.DASHBOARD.JOB_REPORT
            })
        }),
        getDisputeReport:builder.query<IApiResponse<DisputeReportDTO>,void>({
            query:() => ({
                url:API_ROUTES.DASHBOARD.DISPUTE_REPORT
            }),
            providesTags:["disputeChart"]
        })
    })
})


export const {
    useGetAdminDashboardQuery,
    useGetJobReportQuery,
    useGetDisputeReportQuery
} = adminDisputesApi