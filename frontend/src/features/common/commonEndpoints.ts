import { API_ROUTES } from "../../api/apiRoutes";
import { baseApi } from "../../api/baseApi";
import type { IApiResponse, IApiResponseWithPagination } from "../../api/responseType";
import type { DesignerCardDTO, DesignerFilter, DesignGallaryDTO, ISavedDesignDTO } from "./commonInterface";

export const commonApis = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllDesigners: builder.query<IApiResponseWithPagination<DesignerCardDTO[]>, DesignerFilter>({
            query: (args) => ({
                url: API_ROUTES.DESIGNER.GET_ALL_DESIGNERS,
                method: "GET",
                params: {
                    page: args.page,
                    ...(args.full_name && { full_name: args.full_name })
                }
            })
        }),

        getDesignGallary: builder.query<IApiResponseWithPagination<DesignGallaryDTO[]>, {id:string, page:number}>({
            query: ({id, page}) => ({
                url: `${API_ROUTES.DESIGNS.DESIGN_GALLARY}/${id}`,
                method: "GET",
                params: {
                    page: page,
                }
            })
        }),
        getDesignerDetail:builder.query<IApiResponse<DesignerCardDTO>, string>({
            query:(designerId) => ({
                url:API_ROUTES.DESIGNER.GET_DESIGNER_DETAIL(designerId),
                method:"GET"
            })
        }),
        saveDesign:builder.mutation<IApiResponse<boolean>,ISavedDesignDTO>({
            query:(body) => ({
                url:API_ROUTES.SAVE_DESIGNS.ADD_REMOVE,
                method:"PATCH",
                body:body
            }),
            invalidatesTags:["savedDesigns"]
        })
    })
})


export const {
    useGetAllDesignersQuery,
    useGetDesignerDetailQuery,
    useGetDesignGallaryQuery,
    useSaveDesignMutation
} = commonApis