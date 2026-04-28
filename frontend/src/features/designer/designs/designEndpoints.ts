import { API_ROUTES } from "../../../api/apiRoutes";
import { baseApi } from "../../../api/baseApi";
import type { IApiResponse, IApiResponseWithPagination } from "../../../api/responseType";
import type { DesignDetailResponseDTO, DesignResponseDTO, DesignsQueryParms, GetAllDesignCommonResponseDTO } from "./designInterface";

export const designApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMyDesigns: builder.query<IApiResponseWithPagination<DesignResponseDTO[]>, { page: number }>({
            query: ({ page }) => ({
                url: API_ROUTES.DESIGNS.MY_DESIGNS,
                method: "GET",
                params: {
                    page
                }
            }),
            providesTags: ["designs"]
        }),
        addDesign: builder.mutation<IApiResponse, FormData>({
            query: (formData: FormData) => ({
                url: API_ROUTES.DESIGNS.ADD_DESIGN,
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["designs"]
        }),
        getDesignDetail: builder.query<IApiResponse<DesignDetailResponseDTO>, string>({
            query: (id) => ({
                url: `${API_ROUTES.DESIGNS.DESIGN_DETAIL}/${id}`,
                method: "GET"
            }),
            providesTags: (_result, _error, id) => [{ type: "designs", id }]
        }),

        deleteADesign: builder.mutation<IApiResponse, string>({
            query: (id) => ({
                url: `${API_ROUTES.DESIGNS.DESIGN_DELETE}/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["designs"]
        }),

        editDesign: builder.mutation<IApiResponse, { formdata: FormData, id: string }>({
            query: ({ formdata, id }) => ({
                url: `${API_ROUTES.DESIGNS.EDIT_DESIGN}/${id}`,
                method: "PATCH",
                body: formdata
            }),
            invalidatesTags: ["designs"]
        }),

        getAllDesignsCommon: builder.query<IApiResponseWithPagination<GetAllDesignCommonResponseDTO[]>, DesignsQueryParms>({
            query: (args) => {
                const designStyles = args.designStyles?.map(s => s.label).join(",") || "";
                const propertyTypes = args.propertyTypes?.map(s => s.label).join(",") || "";
                const spaceTypes = args.spaceTypes?.map(s => s.label).join(",") || "";
                const sortBy = args.sortBy?.value || "";

                return {
                    url: API_ROUTES.DESIGNS.DESIGNS,
                    method: "GET",
                    params: {
                        page: args.page,
                        ...(designStyles && { designStyles }),
                        ...(propertyTypes && { propertyTypes }),
                        ...(spaceTypes && { spaceTypes }),
                        ...(sortBy && { sortBy }),
                    },
                }
            }
        })
    })
})


export const {
    useGetMyDesignsQuery,
    useAddDesignMutation,
    useGetDesignDetailQuery,
    useGetAllDesignsCommonQuery,
    useDeleteADesignMutation,
    useEditDesignMutation
} = designApi