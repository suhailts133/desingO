
import mongoose from "mongoose";
import type { CreateProposalRepoDataDTO } from "../../DTO/proposal/proposal.js";
import type { IProposal } from "../../interfaces/proposal/IProposal.js";
import type { IProposalRepository } from "../../interfaces/proposal/IProposalRepository.js";
import { ProposalModel } from "../../models/proposal/proposalModal.js";
import { BaseRepository } from "../baseRepository.js";

export class ProposalRepository extends BaseRepository<IProposal> implements IProposalRepository {
    constructor() {
        super(ProposalModel)
    }


    async createProposal(data: CreateProposalRepoDataDTO): Promise<IProposal> {
        return await this.create({
            sourceId: new mongoose.Types.ObjectId(data.sourceId),
            sourceType: data.sourceType,
            clientId: new mongoose.Types.ObjectId(data.clientId),
            designerId: new mongoose.Types.ObjectId(data.designerId),
            drawingFeePerSqFt: data.drawingFeePerSqFt,
            totalDrawingFee: data.totalDrawingFee,
            totalExecutionFee: data.totalExecutionFee,
            totalContractValue: data.totalContractValue,
            advanceFee: data.advanceFee,
            sourceName: data.sourceName,
            expectedCompletionDate: data.expectedCompletionDate,
            services: data.services
        })
    }
    async updateProposal(sourceId: string, data: Partial<IProposal>): Promise<IProposal | null> {
        return await this.updateOne({ sourceId }, data)
    }


    async getProposal(sourceId: string): Promise<IProposal | null> {
        return await this.findOne({ sourceId })
    }
}