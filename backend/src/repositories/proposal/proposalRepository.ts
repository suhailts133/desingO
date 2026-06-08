
import mongoose from "mongoose";
import type { CreateProposalRepoDataDTO, GetProposalDTO, ProposalStatusFilter, ProposalStatusUpdateRepoDTO } from "../../DTO/proposal/proposal.js";
import type { ContractStatus, IProposal } from "../../interfaces/proposal/IProposal.js";
import type { IProposalRepository } from "../../interfaces/proposal/IProposalRepository.js";
import { ProposalModel } from "../../models/proposal/proposalModal.js";
import { BaseRepository } from "../baseRepository.js";
import type { IUser } from "../../interfaces/auth/IUser.js";
import { CONTRACT_STATUS, FIRST_SERVICE_ORDER_NUMBER, ServiceStatus } from "../../shared/enums/proposalEnums.js";

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
            sourceName: data.sourceName,
            expectedCompletionDate: data.expectedCompletionDate,
            services: data.services,
            platformFee: data.platformFee,
            remainingPlatformFee: data.remainingPlatformFee
        })
    }
    async acceptOrRejectProposal(sourceId: string, contractStatus: ContractStatus, overallRejectionReason?: string): Promise<IProposal | null> {

        const filter: ProposalStatusFilter = { sourceId };

        const update: ProposalStatusUpdateRepoDTO = {
            contractStatus,
        };

        if (contractStatus === CONTRACT_STATUS.ACCEPTED) {
            filter["services.order"] = FIRST_SERVICE_ORDER_NUMBER;
            update["services.$.status"] = ServiceStatus.OPEN;
        }

        if (contractStatus === CONTRACT_STATUS.REJECTED && overallRejectionReason) {
            update.overallRejectionReason = overallRejectionReason;
        }

        return await this.updateOne(filter, {
            $set: update,
        });
    }

    async updateServiceStatus(sourceId: string, order: number, status: ServiceStatus): Promise<IProposal | null> {
        return await this.updateOne(
            { sourceId, "services.order": order },
            { $set: { "services.$.status": status } },
        )
    }


    async getProposal(sourceId: string): Promise<GetProposalDTO | null> {
        return await this._model.findOne({ sourceId })
            .populate<{ clientId: IUser }>("clientId")
            .populate<{ designerId: IUser }>("designerId")
    }
}