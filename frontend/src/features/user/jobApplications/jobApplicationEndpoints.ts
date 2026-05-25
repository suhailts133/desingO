import { API_ROUTES } from "../../../api/apiRoutes";
import { baseApi } from "../../../api/baseApi";
import type { IApiResponse, IApiResponseWithPagination } from "../../../api/responseType";
import type { AllJobApplicationsDTO, JobApplicationApprovalOrRejectionPayload, JobApplicationQueryParms } from "./jobApplicationInterFace";

export const jobsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getAllJobApplications: builder.query<IApiResponseWithPagination<AllJobApplicationsDTO[]>, JobApplicationQueryParms>({
            query: (args) => ({
                url: `${API_ROUTES.JOB_APPLICATION.JOB_APPLICATIONS}/${args.id}`,
                method: "GET",
                params: {
                    page: args.page,
                    ...(args.status && { status: args.status }),
                    ...(args.sort && { sort: args.sort }),                          
                    ...(args.startDate && { startDate: args.startDate }),          
                    ...(args.endDate && { endDate: args.endDate }),                
                }
            }),
            providesTags: ["jobApplications"]
        }),


        approveOrRejectJobApplication: builder.mutation<IApiResponse, JobApplicationApprovalOrRejectionPayload>({
            query: ({ id, status, rejectionReason, jobId }) => ({
                url: `${API_ROUTES.JOB_APPLICATION.UPDATE_STATUS}/${id}`,
                method: "PATCH",
                body: { status, rejectionReason, jobId }
            }),
            invalidatesTags: ["jobApplications"]
        })
    })
})


export const {
    useGetAllJobApplicationsQuery,
    useApproveOrRejectJobApplicationMutation
} = jobsApi