import { API_ROUTES } from "../../../api/apiRoutes";
import { baseApi } from "../../../api/baseApi";
import type { IApiResponse, IApiResponseWithPagination } from "../../../api/responseType";
import type { AdminDesignerQueryParams } from "../users/adminUserInterface";
import type { AdminDesignerApprovalPayload, AdminDesignerRequestResponseDTO, AdminDesignersResponseDTO, AdminDesignerStatus } from "./adminDesignerVerificationInterfaces";

export const adminDesignerVerificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllDesignerRequests: builder.query<IApiResponseWithPagination<AdminDesignersResponseDTO[]>, AdminDesignerQueryParams>({
            query: ({ debouncedName, status, page }) => ({
                url: API_ROUTES.ADMIN.GET_ALL_DESIGNER_REQUESTS,
                method: "GET",
                params: {
                    page,
                    ...(debouncedName && { debouncedName }),
                    ...(status && status !== "All" && { status }),
                }
            }),
            providesTags: ["designerRequests"]
        }),
        getDesignerRequest: builder.query<IApiResponse<AdminDesignerRequestResponseDTO>, string>({
            query: (id) => ({
                url: `${API_ROUTES.ADMIN.GET_DESIGNER_REQUEST}/${id}`,
                method: "GET"
            }),
            providesTags: (_result, _error, id) => [{ type: "designerRequests", id }]
        }),
        approveOrRejectDesigner: builder.mutation<IApiResponse<AdminDesignerStatus>, AdminDesignerApprovalPayload>({
            query: ({ id, status, rejectionReason }) => ({
                url: `${API_ROUTES.ADMIN.CHANGE_DESISNER_VERIFICATION_STATUS}/${id}`,
                method: "PATCH",
                body: { status, rejectionReason }
            }),
            invalidatesTags: ["designerRequests"]
        })
    })
})


export const {
    useApproveOrRejectDesignerMutation,
    useGetAllDesignerRequestsQuery,
    useGetDesignerRequestQuery
} = adminDesignerVerificationApi