import { API_ROUTES } from "../../../api/apiRoutes";
import { baseApi } from "../../../api/baseApi";
import type { IApiResponse } from "../../../api/responseType";
import type { DesignerDashboardDTO } from "./dashboardInterface";

export const designerDashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getDesignerDashboard: builder.query<IApiResponse<DesignerDashboardDTO>, void>({
            query: () => ({
                url: API_ROUTES.DASHBOARD.DESIGNER,
                method: "GET"
            })
        })
    })
})


export const { useGetDesignerDashboardQuery } = designerDashboardApi