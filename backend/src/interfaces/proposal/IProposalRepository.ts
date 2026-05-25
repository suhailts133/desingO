import type {  CreateProposalRepoDataDTO } from "../../DTO/proposal/proposal.js";
import type { IProposal } from "./IProposal.js";

export interface IProposalRepository {
    createProposal(data: CreateProposalRepoDataDTO): Promise<IProposal>
}