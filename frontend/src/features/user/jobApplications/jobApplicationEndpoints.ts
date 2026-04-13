import { API_ROUTES } from "../../../api/apiRoutes";
import { baseApi } from "../../../api/baseApi";
import type { IApiResponse, IApiResponseWithPagination } from "../../../api/responseType";
import type { AllJobApplicationsDTO, JobApplicationApprovalOrRejectionPayload, JobApplicationQueryParms } from "./jobApplicationInterFace";

export const jobsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
    
        getAllJobApplications:builder.query<IApiResponseWithPagination<AllJobApplicationsDTO[]>, JobApplicationQueryParms>({
            query:(args) => ({
                url:API_ROUTES.JOB_APPLICATION.ALL_APPLICATIONS,
                method:"GET",
                params:{
                    page:args.page,
                  ...(args.status && {status:args.status}),
                }
            }),
            providesTags:["jobApplications"]
        }),

       

        approveOrRejectJobApplication: builder.mutation<IApiResponse, JobApplicationApprovalOrRejectionPayload>({
            query:({id,status, rejectionReason,jobId}) => ({
                url:`${API_ROUTES.JOB_APPLICATION.UPDATE_STATUS}/${id}`,
                method:"PATCH",
                body:{status,rejectionReason,jobId}
            }),
            invalidatesTags:["jobApplications"]
        })
    })
})


export const {
    useGetAllJobApplicationsQuery,
    useApproveOrRejectJobApplicationMutation
} = jobsApi