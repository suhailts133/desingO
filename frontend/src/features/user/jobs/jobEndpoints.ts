import { API_ROUTES } from "../../../api/apiRoutes";
import { baseApi } from "../../../api/baseApi";
import type { IApiResponse, IApiResponseWithPagination } from "../../../api/responseType";
import type { JobRequestDetailDTO, JobsCommonResponseDTO, JobsQueryParms, JobsResponseDTO } from "./jobInterface";

export const jobsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        postJob: builder.mutation<IApiResponse, FormData>({
            query: (body: FormData) => ({
                url: API_ROUTES.JOB.POST_JOB,
                method: "POST",
                body
            }),
            invalidatesTags: ["jobs"]
        }),
        editJob: builder.mutation<IApiResponse, {formdata:FormData, id:string}>({
            query: ({formdata, id}) => ({
                url: `${API_ROUTES.JOB.EDIT_JOB}/${id}`,
                method: "PATCH",
                body:formdata
            }),
            invalidatesTags: ["jobs"]
        }),

        getMyJobs: builder.query<IApiResponseWithPagination<JobsResponseDTO[]>, { page: number }>({
            query: ({ page }) => ({
                url: API_ROUTES.JOB.MY_JOBS,
                method: "GET",
                params: { page }
            }),
            providesTags: ["jobs"]
        }),

        getAJobRequestDetail: builder.query<IApiResponse<JobRequestDetailDTO>, string>({
            query: (id) => ({
                url: `${API_ROUTES.JOB.JOB_DETAIL}/${id}`,
                method: "GET"
            }),
            providesTags: (_result, _error, id) => [{ type: "jobs", id }]
        }),

        deleteAJob: builder.mutation<IApiResponse, string>({
            query: (id) => ({
                url: `${API_ROUTES.JOB.JOB_DELETE}/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["jobs"]
        }),

        getAllJobsCommon: builder.query<IApiResponseWithPagination<JobsCommonResponseDTO[]>, JobsQueryParms>({
            query: (args) => {
                const designStyles = args.designStyles?.map(s => s.label).join(",") || "";
                const propertyTypes = args.propertyTypes?.map(s => s.label).join(",") || "";
                const timeLines = args.timeLines?.map(s => s.label).join(",") || "";
                const sortBy = args.sortBy?.value || "";

                return {
                    url: API_ROUTES.JOB.JOBS,
                    method: "GET",
                    params: {
                        page: args.page,
                        ...(designStyles && { designStyles }),
                        ...(propertyTypes && { propertyTypes }),
                        ...(timeLines && { timeLines }),
                        ...(sortBy && { sortBy }),
                    },
                }
            }
        }),



        applyForAJob: builder.mutation<IApiResponse, string>({
            query: (jobId) => ({
                url: API_ROUTES.JOB_APPLICATION.APPLY,
                method: "POST",
                body: {jobId}
            }),
            invalidatesTags: ["myJobApplications"]
        })
    })
})


export const {
    usePostJobMutation,
    useGetMyJobsQuery,
    useGetAJobRequestDetailQuery,
    useGetAllJobsCommonQuery,
    useDeleteAJobMutation,
    useApplyForAJobMutation,
    useEditJobMutation
} = jobsApi