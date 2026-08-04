import mongoose from "mongoose";
import type { CreateProposalRepoDataDTO, GetProposalDTO, ProposalStatusFilter, ProposalStatusUpdateRepoDTO } from "../../DTO/proposal/proposal";
import type { ContractStatus, IEscrow, IProposal, ProposalServiceStatus } from "../../interfaces/proposal/IProposal";
import type { IProposalRepository } from "../../interfaces/proposal/IProposalRepository";
import { ProposalModel } from "../../models/proposal/proposalModal";
import { BaseRepository } from "../baseRepository";
import type { IUser } from "../../interfaces/auth/IUser";
import { CONTRACT_STATUS, FIRST_SERVICE_ORDER_NUMBER, ServicePaymentStatus, ServiceStatus } from "../../shared/enums/proposalEnums";

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

    async acceptOrRejectServiceResult(sourceId: string, order: number, status: ProposalServiceStatus): Promise<IProposal | null> {

        return await this.updateOne({ sourceId, "services.order": order }, {
            $set: {
                "services.$.status": status
            }
        })

    }

    async updateService(sourceId: string, order: number, status: ProposalServiceStatus, escrow: Partial<IEscrow>): Promise<IProposal | null> {
        return await this.updateOne(
            { sourceId, "services.order": order },
            {
                $set:
                {
                    "services.$.status": status,
                    "services.$.paymentStatus": ServicePaymentStatus.PAID,
                    "services.$.escrow": escrow,
                    "services.$.paidAt": new Date(),
                }
            },
        )
    }
    async updateServiceVersion(sourceId: string, order: number, status: ProposalServiceStatus, newVersion: number): Promise<IProposal | null> {
        return await this.updateOne(
            { sourceId, "services.order": order },
            {
                $set: {
                    "services.$.status": status,
                    "services.$.currentVersion": newVersion,
                }
            }
        )
    }

    async getProposal(sourceId: string): Promise<GetProposalDTO | null> {
        return await this._model.findOne({ sourceId })
            .populate<{ clientId: IUser }>("clientId")
            .populate<{ designerId: IUser }>("designerId")
    }

    async updateProposal(id: string, filters: Partial<IProposal>): Promise<IProposal | null> {
        return await this.update(id, filters);
    }

}