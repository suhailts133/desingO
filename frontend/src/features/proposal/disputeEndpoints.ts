import { API_ROUTES } from "../../api/apiRoutes";
import { baseApi } from "../../api/baseApi";
import type { IApiResponse } from "../../api/responseType";
import type { AcceptOrRejectDisputeDTO, DisputeResponseDTO, DisputeStatus } from "./proposalInterface";

export const disputeEndpoints = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        reportIssue: builder.mutation<IApiResponse<DisputeResponseDTO>, FormData>({
            query: (formData: FormData) => ({
                url: API_ROUTES.DISPUTE.REPORT,
                method: "POST",
                body: formData
            }),
            invalidatesTags:["proposal"]
        }),

        getDispute: builder.query<IApiResponse<DisputeResponseDTO>, string>({
            query:(proposalId) => ({
                url: `${API_ROUTES.DISPUTE.GET_DISPUTE}/${proposalId}`,
                method:"GET"
            })
        }),
        acceptOrRejectDisputeVerdit:builder.mutation<IApiResponse<DisputeStatus>, AcceptOrRejectDisputeDTO>({
            query:(body) => ({
                url:API_ROUTES.DISPUTE.ACCEPT_OR_REJECT,
                method:"PATCH",
                body
            }),
            
        })



    })
})


export const {
    useReportIssueMutation,
    useGetDisputeQuery,
    useAcceptOrRejectDisputeVerditMutation

} = disputeEndpoints