import mongoose, { type QueryFilter, type UpdateQuery } from "mongoose";
import type { CreateProposalRepoDataDTO, GetProposalDTO, IProposalSourcePopulated, ProposalStatusFilter, ProposalStatusUpdateRepoDTO } from "../../DTO/proposal/proposal";
import type { ContractStatus, EscrowStatus, IEscrow, IProposal, PaymentUpdateStatus, ProposalServiceStatus } from "../../interfaces/proposal/IProposal";
import type { IProposalRepository } from "../../interfaces/proposal/IProposalRepository";
import { ProposalModel } from "../../models/proposal/proposalModal";
import { BaseRepository } from "../baseRepository";
import type { IUser } from "../../interfaces/auth/IUser";
import { CONTRACT_STATUS, FIRST_SERVICE_ORDER_NUMBER, ServicePaymentStatus, ServiceStatus, USER_TYPE } from "../../shared/enums/proposalEnums";
import type { IJobRequest } from "../../interfaces/customer/ICustomer";

export class ProposalRepository extends BaseRepository<IProposal> implements IProposalRepository {
    constructor() {
        super(ProposalModel)
    }

    async getProposalsByUserId(userId: string, role: "Designer" | "Customer"): Promise<IProposalSourcePopulated[]> {
        const objectId = new mongoose.Types.ObjectId(userId);
        const query: QueryFilter<IProposal> = {};

        if (role === USER_TYPE.CUSTOMER) {
            query.clientId = objectId;
        } else {
            query.designerId = objectId;
        }
        return await this._model.find(query).populate<{ sourceId: IJobRequest }>("sourceId").exec();
    }

    async createProposal(data: CreateProposalRepoDataDTO): Promise<IProposal> {
        return await this.create({
            sourceId: new mongoose.Types.ObjectId(data.sourceId),
            activeJobId: new mongoose.Types.ObjectId(data.activeJobId),
            clientId: new mongoose.Types.ObjectId(data.clientId),
            designerId: new mongoose.Types.ObjectId(data.designerId),
            drawingFeePerSqFt: data.drawingFeePerSqFt,
            sourceType: data.sourceType,
            totalDrawingFee: data.totalDrawingFee,
            totalExecutionFee: data.totalExecutionFee,
            totalContractValue: data.totalContractValue,
            totalArea: data.totalArea,
            unit: data.unit,
            currentAmountHeld: data.currentAmountHeld,
            sourceName: data.sourceName,
            expectedCompletionDate: data.expectedCompletionDate,
            services: data.services,
            siteVisitingNeeded: data.siteVisitingNeeded,
            ...(data.expectedSiteVisitingDate && { expectedSiteVisitingDate: data.expectedSiteVisitingDate, }),
            platformFee: data.platformFee,
            remainingPlatformFee: data.remainingPlatformFee
        })
    }

    async acceptOrRejectProposal(sourceId: string, contractStatus: ContractStatus, shouldUpdateService: boolean, overallRejectionReason?: string): Promise<IProposal | null> {
        const filter: ProposalStatusFilter = { sourceId };

        const update: ProposalStatusUpdateRepoDTO = {
            contractStatus,
        };

        if (contractStatus === CONTRACT_STATUS.ACCEPTED && shouldUpdateService) {
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

    async changeEscrowStatus(sourceId: string, order: number, escrowStatus: EscrowStatus): Promise<IProposal | null> {
        const updateDoc: UpdateQuery<IProposal> = {
            $set: {
                "services.$.escrow.status": escrowStatus
            }
        }

        return await this.updateOne({ sourceId, "services.order": order }, updateDoc)
    }

    async updateService(sourceId: string, order: number, status: ProposalServiceStatus, paymentStatus: PaymentUpdateStatus, escrow: Partial<IEscrow>, feeDeduction?: number, currentAmountHeld?: number): Promise<IProposal | null> {
        const updateDoc: UpdateQuery<IProposal> = {
            $set: {
                "services.$.status": status,
                "services.$.paymentStatus": paymentStatus,
                "services.$.escrow": escrow,
                ...(paymentStatus === ServicePaymentStatus.PAID && { "services.$.paidAt": new Date() })
            }
        }
        if (feeDeduction !== undefined && currentAmountHeld !== undefined) {
            updateDoc.$inc = {
                remainingPlatformFee: -feeDeduction,
                currentAmountHeld: currentAmountHeld
            }
        }

        return await this.updateOne({ sourceId, "services.order": order }, updateDoc)
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
    async getProposalbyId(id: string): Promise<IProposal | null> {
        return this.findById(id)
    }



    async updateProposal(id: string, filters: Partial<IProposal>): Promise<IProposal | null> {
        return await this.update(id, filters);
    }

}