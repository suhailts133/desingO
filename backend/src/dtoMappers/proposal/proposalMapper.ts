import type { GetProposalDTO, ProposalDetailDTO, ProposalServiceItemDTO } from "../../DTO/proposal/proposal.js";

export class ProposalMapper {

    static toProposalDetailDTO(data: GetProposalDTO): ProposalDetailDTO {

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
        const clientProfileImage = data.clientId.profileImage?.path ?? data.clientId.google_profile_id
        const designerProfileImage = data.designerId.profileImage?.path ?? data.designerId.google_profile_id

        return {
            id: data.id,
            sourceId: data.sourceId.toString(),
            sourceType: data.sourceType,

            clientId: data.clientId.id,
            clientName: data.clientId.full_name,
            ...(clientProfileImage && { clientProfile: clientProfileImage }),

            designerId: data.designerId.id,
            designerName: data.designerId.full_name,
            ...(designerProfileImage && { designerProfile: designerProfileImage }),
            sourceName: data.sourceName,

            drawingFeePerSqFt: data.drawingFeePerSqFt,
            totalDrawingFee: data.totalDrawingFee,
            totalExecutionFee: data.totalExecutionFee,
            totalContractValue: data.totalContractValue,

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