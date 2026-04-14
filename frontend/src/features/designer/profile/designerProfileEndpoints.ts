import { API_ROUTES } from "../../../api/apiRoutes";
import { baseApi } from "../../../api/baseApi";
import type { IApiResponse } from "../../../api/responseType";
import type { DesignerProfileDTO, DesignerProfileResponseDTO, DesignerUpdateResponseDTO } from "./designerProfileInterface";

export const designerProfileApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({


        getDesignerProfile: builder.query<IApiResponse<DesignerProfileResponseDTO>, void>({
            query: () => ({
                url: API_ROUTES.PROIFILE.GET_DESIGNER_PROFILE,
                method: "GET",
            }),
        }),

        updateProfileImage: builder.mutation<IApiResponse<string>, FormData>({
            query: (formData: FormData) => ({
                url: API_ROUTES.PROIFILE.CHANGE_PROFILE_IMAGE,
                method: "PATCH",
                body: formData
            })
        }),
        updateProfileData: builder.mutation<IApiResponse<DesignerUpdateResponseDTO>, DesignerUpdateResponseDTO>({
            query: (body) => ({
                url: API_ROUTES.PROIFILE.UPDATE_DESIGNER_DATA,
                method: "PATCH",
                body
            })
        })

    })
})


export const {
    useGetDesignerProfileQuery,
    useUpdateProfileImageMutation,
    useUpdateProfileDataMutation
} = designerProfileApi