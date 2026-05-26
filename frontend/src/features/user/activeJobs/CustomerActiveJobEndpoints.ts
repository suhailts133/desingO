import { API_ROUTES } from "../../../api/apiRoutes";
import { baseApi } from "../../../api/baseApi";
import type { IApiResponseWithPagination } from "../../../api/responseType";
import type { ActiveJobFilter, ActiveJobResponseDTO } from "../../designer/activeJobs/designerActiveJobsInterface";

export const customerActiveJobApi = baseApi.injectEndpoints({
    endpoints:(builder) => ({
        getCustomerActiveJobs:builder.query<IApiResponseWithPagination<ActiveJobResponseDTO[]>,ActiveJobFilter>({
            query:(args)=> ({
                url:API_ROUTES.ACTIVE_JOB.CUSTOMER,
                method:"GET",
                params:{
                    page:args.page,
                    ...(args.sourceType && {sourceType:args.sourceType})
                }
            })
        })
    })
})


export const {useGetCustomerActiveJobsQuery}= customerActiveJobApi