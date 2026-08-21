
import { API_ROUTES } from "../../../api/apiRoutes";
import { baseApi } from "../../../api/baseApi";
import type { IApiResponse, IApiResponseWithPagination } from "../../../api/responseType";
import type { AllDisputeAdminDTO, DisputeAdminFilters, DisputeDetailAdminDTO, DisputeSolutionDTO, DisputeSolutionResponseDTO } from "./adminDisputeInterface";



export const adminDisputesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllDIspute: builder.query<IApiResponseWithPagination<AllDisputeAdminDTO[]>, DisputeAdminFilters>({
            query: ({ page, sort, status }) => ({
                url: API_ROUTES.ADMIN.GET_ALL_DISPUTES,
                method: "GET",
                params: {
                    page,
                    ...(sort && { sort }),
                    ...(status && status !== "All" && { status })
                }
            }),
            providesTags: ["dispute"]

        }),

        getDisputeDetail: builder.query<IApiResponse<DisputeDetailAdminDTO>, string>({
            query: (disputeId) => ({
                url: `${API_ROUTES.ADMIN.GET_DISPUTE}/${disputeId}`,
                method: "GET",
            }),
            providesTags: (_result, _error, arg) => [{ type: 'dispute', id: arg }]
        }),
        giveVerdit: builder.mutation<IApiResponse<DisputeSolutionResponseDTO>, DisputeSolutionDTO>({
            query: (body) => ({
                url: API_ROUTES.ADMIN.GIVE_VERDIT,
                method: "POST",
                body
            }),
            invalidatesTags: ["dispute"]
        })

    })
})


export const {
    useGetAllDIsputeQuery,
    useGetDisputeDetailQuery,
    useGiveVerditMutation

} = adminDisputesApi