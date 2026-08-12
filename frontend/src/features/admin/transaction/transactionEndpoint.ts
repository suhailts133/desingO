
import { API_ROUTES } from "../../../api/apiRoutes";
import { baseApi } from "../../../api/baseApi";
import type { IApiResponseWithPagination } from "../../../api/responseType";
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

       

    })
})


export const {
    useGetAllTransactionQuery

} = transactionAPi