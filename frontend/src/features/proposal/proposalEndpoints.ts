import { API_ROUTES } from "../../api/apiRoutes";
import { baseApi } from "../../api/baseApi";
import type { IApiResponse } from "../../api/responseType";
import type { CreateProposalDTO, ProposalAcceptOrRejectDTO, ProposalDetailDTO, ProposalInputData, ProposalInputDataPayload, VersionAcceptOrRejectDTO } from "./proposalInterface";

export const proposalApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProposal: builder.query<IApiResponse<ProposalDetailDTO>, string>({
            query: (jobId) => ({
                url: `${API_ROUTES.PROPOSAL.MY_PROPOSAL}/${jobId}`,
                method: "GET"
            }),
            providesTags: ["proposal"]
        }),

        uploadResult: builder.mutation<IApiResponse, FormData>({
            query: (formData: FormData) => ({
                url: API_ROUTES.PROPOSAL.UPLOAD_RESULT,
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["proposal"]
        }),
        approveOrRejectVersionResult: builder.mutation<IApiResponse, VersionAcceptOrRejectDTO>({
            query: (body: VersionAcceptOrRejectDTO) => ({
                url: API_ROUTES.PROPOSAL.APPROVE_REJECT_VERSION,
                method: "PATCH",
                body
            }),
            invalidatesTags: ["proposal"]
        }),

        getProposalPrefillData: builder.query<IApiResponse<ProposalInputData>, ProposalInputDataPayload>({
            query: (body) => ({
                url: `${API_ROUTES.PROPOSAL.PREFILL_DATA}/${body.jobId}/${body.sourceType}`,
                method: "GET",

            })
        }),
        createProposal: builder.mutation<IApiResponse, CreateProposalDTO>({
            query: (body) => ({
                url: API_ROUTES.PROPOSAL.CREATE,
                method: "POST",
                body
            })
        }),
        approveReject: builder.mutation<IApiResponse<"Accepted" | "Rejected">, ProposalAcceptOrRejectDTO>({
            query: (body) => ({
                url: API_ROUTES.PROPOSAL.APPROVE_REJECT,
                method: "PATCH",
                body
            }),
            invalidatesTags: ["proposal"]
        }),
    })
})


export const {
    useGetProposalQuery,
    useGetProposalPrefillDataQuery,
    useCreateProposalMutation,
    useApproveRejectMutation,
    useUploadResultMutation,
    useApproveOrRejectVersionResultMutation,
} = proposalApi