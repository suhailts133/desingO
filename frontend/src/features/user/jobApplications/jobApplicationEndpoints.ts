import { API_ROUTES } from "../../../api/apiRoutes";
import { baseApi } from "../../../api/baseApi";
import type { IApiResponse, IApiResponseWithPagination } from "../../../api/responseType";
import type { AllJobApplicationsDTO, JobApplicationApprovalOrRejectionPayload, JobApplicationQueryParms } from "./jobApplicationInterFace";

export const jobsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllJobApplications: builder.query<IApiResponseWithPagination<AllJobApplicationsDTO[]>, JobApplicationQueryParms>({
      query: ({ sortBy, startDate, status, id, endDate, page }) => ({
        url: `${API_ROUTES.JOB_APPLICATION.JOB_APPLICATIONS}/${id}`,
        method: "GET",
        params: {
          page,
          ...(status && status !== "All" && { status }),
          ...(sortBy && { sortBy }),
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        },
      }),
      providesTags: ["jobApplications"],
    }),

    approveOrRejectJobApplication: builder.mutation<IApiResponse, JobApplicationApprovalOrRejectionPayload>({
      query: ({ id, status, rejectionReason, jobId }) => ({
        url: `${API_ROUTES.JOB_APPLICATION.UPDATE_STATUS}/${id}`,
        method: "PATCH",
        body: { status, rejectionReason, jobId },
      }),
      invalidatesTags: ["jobApplications", "jobs"],
    }),
  }),
});

export const { useGetAllJobApplicationsQuery, useApproveOrRejectJobApplicationMutation } = jobsApi;
