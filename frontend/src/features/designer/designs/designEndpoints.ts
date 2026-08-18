import { API_ROUTES } from "../../../api/apiRoutes";
import { baseApi } from "../../../api/baseApi";
import type { IApiResponse, IApiResponseWithPagination } from "../../../api/responseType";
import type { HireDesignerFields, HireDesignerFilter, HireDesignerRequests } from "../../user/jobs/jobInterface";
import type { AcceptOrRejectHireDesigner, DesignDetailResponseDTO, DesignResponseDTO, DesignsQueryParms, GetAllDesignCommonResponseDTO } from "./designInterface";

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

        hireDesigner: builder.mutation<IApiResponse, HireDesignerFields>({
            query: (body: HireDesignerFields) => ({
                url: API_ROUTES.HIRE_DESIGNER.CREATE,
                method: "POST",
                body
            })
        }),
        approveOrRejectHireRequest: builder.mutation<IApiResponse, AcceptOrRejectHireDesigner>({
            query: (body: AcceptOrRejectHireDesigner) => ({
                url: API_ROUTES.HIRE_DESIGNER.ACCEPT_OR_REJECT,
                method: "PATCH",
                body
            }),
            invalidatesTags: ["hireRequest"]
        }),

        hireRequest: builder.query<IApiResponseWithPagination<HireDesignerRequests[]>, HireDesignerFilter>({
            query: (args) => ({
                url: `${API_ROUTES.HIRE_DESIGNER.REQUEST_PER_DESIGN}/${args.designId}`,
                method: "GET",
                params: {
                    page: args.page,
                    ...(args.sort && { sort: args.sort }),
                    ...(args.startDate && { startDate: args.startDate }),
                    ...(args.endDate && { endDate: args.endDate }),
                },

            }),
            providesTags: ["hireRequest"]

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
    useEditDesignMutation,
    useHireDesignerMutation,
    useHireRequestQuery,
    useApproveOrRejectHireRequestMutation,
} = designApi