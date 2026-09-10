
import { API_ROUTES } from "../../../api/apiRoutes";
import { baseApi } from "../../../api/baseApi";
import type { IApiResponse, IApiResponseWithPagination } from "../../../api/responseType";
import type { ReportQueryParams, ReportResponseDto } from "../dashboard/adminDashboardInterface";
import type { AllTransactionDTO, TransactionFilter } from "./transactionInterface";



export const transactionAPi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllTransaction: builder.query<IApiResponseWithPagination<AllTransactionDTO[]>, TransactionFilter>({
            query: ({ page, type }) => ({
                url: API_ROUTES.ADMIN.GET_ALL_TRANSACTION,
                method: "GET",
                params: {
                    page,
                    ...(type && type !== "All" && { type })
                }
            }),
        }),
        transactionReport: builder.query<IApiResponse<ReportResponseDto>, ReportQueryParams>({
            query: (params) => ({
                url: API_ROUTES.ADMIN.TRANSACTION_REPORT,
                method: "GET",
                params,
            }),
        }),



    })
})


export const {
    useGetAllTransactionQuery,
    useTransactionReportQuery

} = transactionAPi