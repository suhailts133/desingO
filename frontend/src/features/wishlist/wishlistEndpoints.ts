
import { API_ROUTES } from "../../api/apiRoutes";
import { baseApi } from "../../api/baseApi";
import type { IApiResponseWithPagination } from "../../api/responseType";
import type { GetAllDesignCommonResponseDTO } from "../designer/designs/designInterface";

export const saveDesignApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getMySavedDesigns: builder.query<IApiResponseWithPagination<GetAllDesignCommonResponseDTO[]>, {page:number}>({
            query: (args) => ({
                url: API_ROUTES.SAVE_DESIGNS.MY_DESIGNS,
                method: "GET",
                params: {
                    page: args.page,
                }
            }),
            providesTags:["savedDesigns"]
        }),
      

    })
})


export const {
    useGetMySavedDesignsQuery
} = saveDesignApi