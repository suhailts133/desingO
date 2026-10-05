import { API_ROUTES } from "../../../api/apiRoutes";
import { baseApi } from "../../../api/baseApi";
import type { IApiResponseWithPagination } from "../../../api/responseType";
import type { ActiveJobResponseDTO, ActiveJobsQueryParams } from "../../designer/activeJobs/designerActiveJobsInterface";

export const customerActiveJobApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerActiveJobs: builder.query<IApiResponseWithPagination<ActiveJobResponseDTO[]>, ActiveJobsQueryParams>({
      query: ({ sourceType, sortBy, sourceName, startDate, page, proposalStatus, status, endDate }) => ({
        url: API_ROUTES.ACTIVE_JOB.CUSTOMER,
        method: "GET",
        params: {
          page,
          ...(sourceName && { sourceName }),
          ...(sourceType && sourceType !== "All" && { sourceType }),
          ...(proposalStatus && proposalStatus !== "All" && { proposalStatus }),
          ...(status && status !== "All" && { status }),
          ...(sortBy && { sortBy }),
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        },
      }),
    }),
  }),
});

export const { useGetCustomerActiveJobsQuery } = customerActiveJobApi;
