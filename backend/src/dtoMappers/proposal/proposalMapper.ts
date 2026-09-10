import type { AllVersion, floorPlanDTO, GetProposalDTO, ProposalDetailDTO, ProposalServiceItemDTO } from "../../DTO/proposal/proposal";
import type { IFloorPlan } from "../../interfaces/proposal/IFloorPlan";
import type { IServiceVersion } from "../../interfaces/proposal/IProposal";

export class ProposalMapper {

    static toProposalDetailDTO(data: GetProposalDTO, allVersions: IServiceVersion[], floorPlansData: IFloorPlan[]): ProposalDetailDTO {

        const proposalServices: ProposalServiceItemDTO[] = data.services.map(d => {
            const serviceVersions = allVersions.filter(v => v.serviceOrder === d.order)

            const groupedVersions: AllVersion[] = serviceVersions.map(v => ({
                versionNumber: v.version,
                uploadedAt: v.createdAt.toDateString(),
                versionData: {
                    serviceOrder: v.serviceOrder,
                    versionId: v.id,
                    images: v.images.map(img => img.path),
                    status: v.status,
                    ...(v.rejectionReason && { rejectionReason: v.rejectionReason })
                }
            }))

            return {
                ...(d.escrow?.status && { escrowStatus: d.escrow.status }),
                ...(d.escrow?.designerPayout && { amountHeld: d.escrow.designerPayout }),
                serviceName: d.serviceName,
                order: d.order,
                price: d.price,
                executionPrice: d.executionPrice,
                status: d.status,
                uploadedImages: d.uploadedImages,
                currentVersion: d.currentVersion,
                expectedDeliveryDate: d.expectedDeliveryDate.toISOString(),
                ...(d.actualDeliveryDate && { actualDeliveryDate: d.actualDeliveryDate.toDateString() }),
                paymentStatus: d.paymentStatus,
                ...(d.paidAt && { paidAt: d.paidAt.toDateString() }),
                versions: groupedVersions
            }
        })

        const clientProfileImage = data.clientId.profileImage?.path ?? data.clientId.google_profile_id
        const designerProfileImage = data.designerId.profileImage?.path ?? data.designerId.google_profile_id
        const floorPlans: floorPlanDTO[] = floorPlansData.map(e => {
            return {
                id: e.id,
                version: e.version,
                path: e.plans.path,
                status: e.status,
                ...(e.rejectionReason && { rejectionReason: e.rejectionReason }),
                createdAt: e.createdAt.toDateString()
            }
        }) ?? []
        return {
            id: data.id,
            sourceId: data.sourceId.toString(),
            totalArea: data.totalArea,
            unit: data.unit,
            floorPlanVersion: data.floorPlanVersion,
            isFloorPlanApproved: data.isFloorPlanApproved,
            isReviewd: data.isReviewd,
            disputeCount: data.disputeCount,
            siteVisitingRequired: data.siteVisitingNeeded,
            floorPlans,
            ...(data.expectedSiteVisitingDate && { expectedSiteVisitingDate: data.expectedSiteVisitingDate.toISOString() }),

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
            ...(data.expectedCompletionDate && { expectedCompletionDate: data.expectedCompletionDate.toISOString() }),
            ...(data.actualCompletionDate && { actualCompletionDate: data.actualCompletionDate.toDateString() }),
            createdAt: data.createdAt.toDateString(),

            services: proposalServices
        }
    }
}