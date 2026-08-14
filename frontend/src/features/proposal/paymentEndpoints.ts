import { API_ROUTES } from "../../api/apiRoutes";
import { baseApi } from "../../api/baseApi";
import type { IApiResponse } from "../../api/responseType";

export const paymentEndpoints = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createIntent: builder.mutation<IApiResponse<string>, string>({
            query: (jobId) => ({
                url: API_ROUTES.PAYMENT.INTENT,
                method: "POST",
                body: { jobId }
            })
        }),
        getPaymentId: builder.mutation<IApiResponse, string>({
            query: (intentId) => ({
                url: API_ROUTES.PAYMENT.VERIFY,
                method: "POST",
                body: { intentId }
            })
        }),



    })
})


export const {
    useCreateIntentMutation,
    useGetPaymentIdMutation

} = paymentEndpoints