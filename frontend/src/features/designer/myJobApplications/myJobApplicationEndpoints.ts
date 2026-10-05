import { API_ROUTES } from "../../../api/apiRoutes";
import { baseApi } from "../../../api/baseApi";
import type { IApiResponse, IApiResponseWithPagination } from "../../../api/responseType";
import type { JobApplicationQueryParms } from "../../user/jobApplications/jobApplicationInterFace";
import type { MyJobApplicationsDTO } from "./myJobApplicationInterFace";

export const jobsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyJobApplications: builder.query<IApiResponseWithPagination<MyJobApplicationsDTO[]>, JobApplicationQueryParms>({
      query: ({ sortBy, startDate, status, endDate, page }) => ({
        url: API_ROUTES.JOB_APPLICATION.MY_APPLICATIONS,
        method: "GET",
        params: {
          page,
          ...(status && status !== "All" && { status }),
          ...(sortBy && { sortBy }),
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        },
      }),
      providesTags: ["myJobApplications"],
    }),
    deleteMyJobApplication: builder.mutation<IApiResponse, string>({
      query: (id) => ({
        url: `${API_ROUTES.JOB_APPLICATION.DELETE}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["myJobApplications"],
    }),
  }),
});

export const { useGetMyJobApplicationsQuery, useDeleteMyJobApplicationMutation } = jobsApi;
