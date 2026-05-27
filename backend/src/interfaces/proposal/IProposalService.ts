import type { CreateProposalDTO, ProposalDetailDTO } from "../../DTO/proposal/proposal.js";
import type { IApiResponse } from "../base/IApiResponse.js";

export interface IProposalService {
    createProposal(data: CreateProposalDTO): Promise<IApiResponse>
    getProposal(sourceId: string): Promise<IApiResponse<ProposalDetailDTO | null>>
    // getProposalTemplateForJobRequest(id:string):Promise<IApiResponse<ProposalTemplate>>
    // getProposalTemplateForDirecHire(id:string):Promise<IApiResponse<ProposalTemplate>>
}