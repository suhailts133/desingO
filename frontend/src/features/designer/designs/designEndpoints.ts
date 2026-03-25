import { API_ROUTES } from "../../../api/apiRoutes";
import { baseApi } from "../../../api/baseApi";
import type { IApiResponse, IApiResponseWithPagination } from "../../../api/responseType";
import type { DesignDetailResponseDTO, DesignResponseDTO, DesignsQueryParms, GetAllDesignCommonResponseDTO } from "./designInterface";

export const designApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllDesign: builder.query<IApiResponseWithPagination<DesignResponseDTO[]>, { page: number }>({
            query: ({ page }) => ({
                url: API_ROUTES.DESIGNER.MY_DESIGNS,
                method: "GET",
                params: {
                    page
                }
            }),
            providesTags: ["designs"]
        }),
        addDesign: builder.mutation<IApiResponse, FormData>({
            query: (formData: FormData) => ({
                url: API_ROUTES.DESIGNER.ADD_DESIGN,
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["designs"]
        }),
        getDesignDetail: builder.query<IApiResponse<DesignDetailResponseDTO>, string>({
            query: (id) => ({
                url: `${API_ROUTES.DESIGNER.DESIGN_DETAIL}/${id}`,
                method: "GET"
            }),
            providesTags: (_result, _error, id) => [{ type: "designs", id }]
        }),

        deleteADesign: builder.mutation<IApiResponse, string>({
            query: (id) => ({
                url: `${API_ROUTES.DESIGNER.DESIGN_DELETE}/${id}`,
                method: "DELETE"
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
                    url: API_ROUTES.DESIGNER.DESIGNS,
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
    useGetAllDesignQuery,
    useAddDesignMutation,
    useGetDesignDetailQuery,
    useGetAllDesignsCommonQuery,
    useDeleteADesignMutation
} = designApi