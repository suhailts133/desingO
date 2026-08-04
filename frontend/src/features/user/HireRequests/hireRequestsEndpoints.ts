import { API_ROUTES } from "../../../api/apiRoutes";
import { baseApi } from "../../../api/baseApi";
import type { IApiResponseWithPagination } from "../../../api/responseType";
import type { GetMyHireDesignerRequestResponseDTO, MyHireDesignerFilter } from "./myHireDesignerRequestInterface";

export const myHireRequestApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        myHireRequests: builder.query<IApiResponseWithPagination<GetMyHireDesignerRequestResponseDTO[]>, MyHireDesignerFilter>({
            query: (args) => ({
                url: API_ROUTES.HIRE_DESIGNER.MY_REQUESTS,
                method: "GET",
                params: {
                    page: args.page,
                    ...(args.sort && { sort: args.sort }),
                    ...(args.startDate && { startDate: args.startDate }),
                    ...(args.endDate && { endDate: args.endDate }),
                }
            })

        }),

    })
})


export const {
    useMyHireRequestsQuery
} = myHireRequestApi