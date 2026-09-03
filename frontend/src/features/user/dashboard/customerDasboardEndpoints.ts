import { API_ROUTES } from "../../../api/apiRoutes";
import { baseApi } from "../../../api/baseApi";
import type { IApiResponse } from "../../../api/responseType";
import type { CustomerDashboardDTO } from "./customerDashboardInterface";

export const customerDashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getCustomerDashboard: builder.query<IApiResponse<CustomerDashboardDTO>, void>({
            query: () => ({
                url: API_ROUTES.DASHBOARD.CUSTOMER,
                method: "GET"
            })
        })
    })
})


export const { useGetCustomerDashboardQuery } = customerDashboardApi