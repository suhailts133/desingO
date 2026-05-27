import { API_ROUTES } from "../../api/apiRoutes";
import { baseApi } from "../../api/baseApi";
import type { IApiResponse } from "../../api/responseType";
import type { ProposalDetailDTO } from "./proposalInterface";

export const proposalApi = baseApi.injectEndpoints({
    endpoints:(builder) => ({
        getProposal:builder.query<IApiResponse<ProposalDetailDTO>, string>({
            query:(jobId) => ({
                url:`${API_ROUTES.PROPOSAL.MY_PROPOSAL}/${jobId}`,
                method:"GET"
            })
        })
    })
})


export const {
    useGetProposalQuery
} = proposalApi