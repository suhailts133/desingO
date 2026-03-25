
import { API_ROUTES } from "../../../api/apiRoutes";
import { baseApi } from "../../../api/baseApi";
import type { IApiResponse, IApiResponseWithPagination } from "../../../api/responseType";
import type { AdminUserQueryParams, AdminUsersResponseDTO, AdminUserToggleStatusResposne, ToggleStatusPayload } from "./adminUserInterface";


export const adminUsersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllusers: builder.query<IApiResponseWithPagination<AdminUsersResponseDTO[]>, AdminUserQueryParams>({
            query: ({ page, name, role, status }) => ({
                url: API_ROUTES.ADMIN.GET_ALL_USERS,
                method: "GET",
                params: {
                    page,
                    ...(name && { name }),
                    ...(role && role !== "All" && { role }),
                    ...(status && status !== "All" && { is_blocked:status=== "Blocked" })
                }
            }),
            providesTags:["users"]
        }),
        
        getUser: builder.query<IApiResponse<AdminUsersResponseDTO>, string>({
            query: (id) => ({
                url: `${API_ROUTES.ADMIN.GET_ALL_USER}/${id}`,
                method: "GET",
            }),
            providesTags:(_result, _error, arg) => [{ type: 'users', id: arg }]
        }),
        toggleStatus: builder.mutation<IApiResponse<AdminUserToggleStatusResposne>, ToggleStatusPayload>({
            query: ({ id, is_blocked }) => ({
                url: `${API_ROUTES.ADMIN.TOGGLE_USER_STATUS}/${id}`,
                method: "PATCH",
                body: { is_blocked },
            }),
            invalidatesTags:["users"]
        })
    })
})


export const {
    useGetAllusersQuery,
    useGetUserQuery,
    useToggleStatusMutation
} = adminUsersApi