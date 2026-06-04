import type { ProposalDetailDTO, ProposalServiceItemDTO } from "../../DTO/proposal/proposal.js";
import type { IProposal } from "../../interfaces/proposal/IProposal.js";

export class ProposalMapper {

    static toProposalDetailDTO(data: IProposal): ProposalDetailDTO {

        const proposalServices: ProposalServiceItemDTO[] = data.services.map(d => ({
            serviceName: d.serviceName,
            order: d.order,
            price: d.price,
            executionPrice: d.executionPrice,
            status: d.status,

            uploadedImages: d.uploadedImages,
            currentVersion: d.currentVersion,
            expectedDeliveryDate: d.expectedDeliveryDate.toDateString(),
            ...(d.actualDeliveryDate && { actualCompletionDate: d.actualDeliveryDate.toDateString() }),
            paymentStatus: d.paymentStatus,
            ...(d.paidAt && { paidAt: d.paidAt.toDateString() }),
            ...(d.rejectionReason && { rejectionReason: d.rejectionReason }),
        }))

        return {
            id: data.id,
            sourceId: data.sourceId.toString(),
            sourceType: data.sourceType,
            clientId: data.clientId.toString(),
            designerId: data.clientId.toString(),
            sourceName: data.sourceName,
          
            drawingFeePerSqFt: data.drawingFeePerSqFt,
            totalDrawingFee: data.totalDrawingFee,
            totalExecutionFee: data.totalExecutionFee,
            advanceFee: data.advanceFee,
            totalContractValue: data.totalContractValue,
            advancePaid: data.advancePaid,
            ...(data.advancePaidAt && { advancePaidAt: data.advancePaidAt.toDateString() }),
            contractStatus: data.contractStatus,
            ...(data.overallRejectionReason && { overallRejectionReason: data.overallRejectionReason }),
            ...(data.clientAcceptedAt && { clientAcceptedAt: data.clientAcceptedAt.toDateString() }),
            ...(data.expectedCompletionDate && { expectedCompletionDate: data.expectedCompletionDate.toDateString() }),
            ...(data.actualCompletionDate && { actualCompletionDate: data.actualCompletionDate.toDateString() }),
            createdAt: data.createdAt.toDateString(),
            services: proposalServices

        }
    }
}