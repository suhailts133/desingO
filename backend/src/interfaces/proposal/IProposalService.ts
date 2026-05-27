import type { CreateProposalDTO, ProposalDetailDTO, ProposalInputData } from "../../DTO/proposal/proposal.js";
import type { IApiResponse } from "../base/IApiResponse.js";

export interface IProposalService {
    createProposal(data: CreateProposalDTO): Promise<IApiResponse>
    getProposal(sourceId: string): Promise<IApiResponse<ProposalDetailDTO | null>>
    getProposalInputForJobRequest(id:string):Promise<IApiResponse<ProposalInputData>>
    getProposalTemplateForDirecHire(id:string):Promise<IApiResponse<ProposalInputData>>
}