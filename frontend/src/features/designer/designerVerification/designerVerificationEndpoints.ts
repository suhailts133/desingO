import { baseApi } from "../../../api/baseApi";
import type { IApiResponse } from "../../../api/responseType";
import { API_ROUTES } from "../../../api/apiRoutes";


export const designerApi = baseApi.injectEndpoints({
    endpoints:(builder) => ({
        designerVerification:builder.mutation<IApiResponse, FormData>({
            query:(formData:FormData) => ({
                url:API_ROUTES.DESIGNER.DESIGNER_VERIFICATION,
                method:"POST",
                body:formData
            })
        }),
    
    }),
})


export const {
    useDesignerVerificationMutation
} = designerApi