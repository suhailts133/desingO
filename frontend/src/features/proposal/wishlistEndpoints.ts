import { API_ROUTES } from "../../api/apiRoutes";
import { baseApi } from "../../api/baseApi";
import type { IApiResponse, IApiResponseWithPagination } from "../../api/responseType";
import type { ReviewFilters, ReviewPayload, ReviewPayloadFields, ReviewsLIST } from "./proposalInterface";

export const wishlistApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addYourReview: builder.mutation<IApiResponse<ReviewPayloadFields>, ReviewPayload>({
            query: (body) => ({
                url: API_ROUTES.REVIEW.CREATE,
                method: "POST",
                body
            })
        }),
        getMyReivews: builder.query<IApiResponseWithPagination<ReviewsLIST[]>, ReviewFilters>({
            query: ({ designerId, page }) => ({
                url: `${API_ROUTES.REVIEW.MY_REVIEWS}/${designerId}`,
                method: "GET",
                params: {
                    page
                }
            })
        })
    }),
})


export const {
    useAddYourReviewMutation,
    useGetMyReivewsQuery
} = wishlistApi