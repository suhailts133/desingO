import { API_ROUTES } from "../../../api/apiRoutes";
import { baseApi } from "../../../api/baseApi";
import type { IApiResponse, IApiResponseWithPagination } from "../../../api/responseType";
import type { JobApplicationQueryParms, MyJobApplicationsDTO } from "./myJobApplicationInterFace";

export const jobsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getMyJobApplications: builder.query<IApiResponseWithPagination<MyJobApplicationsDTO[]>, JobApplicationQueryParms>({
            query: (args) => ({
                url: API_ROUTES.JOB_APPLICATION.MY_APPLICATIONS,
                method: "GET",
                params: {
                    page: args.page,
                    ...(args.status && { status: args.status }),
                }
            }),
            providesTags:["myJobApplications"]
        }),
        deleteMyJobApplication: builder.mutation<IApiResponse, string>({
            query: (id) => ({
                url: `${API_ROUTES.JOB_APPLICATION.DELETE}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags:["myJobApplications"]
        }),

    })
})


export const {
    useGetMyJobApplicationsQuery,
    useDeleteMyJobApplicationMutation
} = jobsApi