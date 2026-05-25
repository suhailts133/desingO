import type { CreateProposalDTO, ProposalTemplate } from "../../DTO/proposal/proposal.js";
import type { IApiResponse } from "../base/IApiResponse.js";

export interface IProposalService{
    createProposal(data:CreateProposalDTO):Promise<IApiResponse>
    // getProposalTemplateForJobRequest(id:string):Promise<IApiResponse<ProposalTemplate>>
    // getProposalTemplateForDirecHire(id:string):Promise<IApiResponse<ProposalTemplate>>
}