import { API_ROUTES } from "../../../api/apiRoutes";
import { baseApi } from "../../../api/baseApi";
import type { IApiResponse } from "../../../api/responseType";

import type {  UserProfileResponseDTO, UserProfileUpdateDTO } from "./customerProfileInterfaces";

export const designerProfileApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({


        getUserProfile: builder.query<IApiResponse<UserProfileResponseDTO>, void>({
            query: () => ({
                url: API_ROUTES.PROIFILE.GET_CUSTOMER_PROFILE,
                method: "GET",
            }),
        }),


        updateUserProfileData: builder.mutation<IApiResponse<UserProfileUpdateDTO>, UserProfileUpdateDTO>({
            query: (body) => ({
                url: API_ROUTES.PROIFILE.UPDATE_CUSTOMER_DATA,
                method: "PATCH",
                body
            })
        })

    })
})


export const {
    useGetUserProfileQuery,
    useUpdateUserProfileDataMutation
} = designerProfileApi