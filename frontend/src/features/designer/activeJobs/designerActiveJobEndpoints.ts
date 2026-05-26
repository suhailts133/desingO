import { API_ROUTES } from "../../../api/apiRoutes";
import { baseApi } from "../../../api/baseApi";
import type { IApiResponseWithPagination } from "../../../api/responseType";
import type { ActiveJobResponseDTO, ActiveJobFilter } from "./designerActiveJobsInterface";

export const designerActiveJobApi = baseApi.injectEndpoints({
    endpoints:(builder) => ({
        getDesignerActiveJobs:builder.query<IApiResponseWithPagination<ActiveJobResponseDTO[]>,ActiveJobFilter>({
            query:(args)=> ({
                url:API_ROUTES.ACTIVE_JOB.DESIGNER,
                method:"GET",
                params:{
                    page:args.page,
                    ...(args.sourceType && {sourceType:args.sourceType})
                }
            })
        })
    })
})


export const {useGetDesignerActiveJobsQuery}= designerActiveJobApi