import type { AllDisputeAdminDTO, currentDisputedService, DisputeDetailAdminDTO, DisputePopulated, DisputePopulatedAll, DisputeResponseDTO } from "../../DTO/proposal/dispute";
import type { IDispute } from "../../interfaces/proposal/IDispute";
import type { IServiceItem } from "../../interfaces/proposal/IProposal";

export class DisputeMapper {

    static toDisputeResponseDTO(data: IDispute | DisputePopulatedAll, CStatus?: string): DisputeResponseDTO {
        return {
            id: data.id,
            ...(CStatus && { contractStatus: CStatus }),
            raisedBy: data.raisedBy,
            reason: data.reason,
            evidence: data.evidence.map(e => e.path),
            serviceOrder: data.serviceOrder,
            status: data.status,
            ...(data.resolution && { resolution: data.resolution }),
            ...(data.resolutionType && { resolutionType: data.resolutionType }),
        }
    }

    static toDisputeDTOList(data: DisputePopulatedAll[]): DisputeResponseDTO[] {
        return data.map(dispute => DisputeMapper.toDisputeResponseDTO(dispute))
    }

    static toAdminDisputeDTOList(data: DisputePopulated[]): AllDisputeAdminDTO[] {
        return data.map(d => ({
            id: d.id,
            raisedBy: d.raisedBy,
            createdAt: d.createdAt.toDateString(),
            status: d.status,
            type: d.type,
            reason: d.reason
        }))
    }

    static toAdminDisputeDTO(data: DisputePopulatedAll, serviceData: IServiceItem): DisputeDetailAdminDTO {
        const customerProfileImage = data.customerId.profileImage?.path ?? data.customerId.google_profile_id
        const designerProfileImage = data.designerId.profileImage?.path ?? data.designerId.google_profile_id
        const serviceImages = serviceData.uploadedImages.map(e => e.path)
        const service: currentDisputedService = {
            serviceName: serviceData.serviceName,
            order: serviceData.order,
            price: serviceData.price,
            executionPrice: serviceData.executionPrice,
            serviceStatus: serviceData.status,
            uploadedImages: serviceImages,
            currentVersion: serviceData.currentVersion,
            expectedDeliveryDate: serviceData.expectedDeliveryDate.toDateString(),

            ...(serviceData.actualDeliveryDate && {
                actualDeliveryDate: serviceData.actualDeliveryDate.toDateString(),
            }),

            ...(serviceData.paidAt && {
                paidAt: serviceData.paidAt.toDateString(),
            }),

            ...(serviceData.escrow?.amountHeld !== undefined && {
                amountHeld: serviceData.escrow.amountHeld,
            }),

            ...(serviceData.escrow?.platformCommission !== undefined && {
                platformCommission: serviceData.escrow.platformCommission,
            }),

            ...(serviceData.escrow?.designerPayout !== undefined && {
                designerPayout: serviceData.escrow.designerPayout,
            }),

            ...(serviceData.escrow?.status && {
                escrowStatus: serviceData.escrow.status,
            }),

            ...(serviceData.escrow?.releasedAt && {
                releasedAt: serviceData.escrow.releasedAt.toDateString(),
            }),
        };
        return {
            id: data.id,
            proposalId: data.proposalId.id,
            raisedBy: data.raisedBy,
            reason: data.reason,
            type: data.type,
            status: data.status,
            createdAt: data.createdAt.toDateString(),
            evidence: data.evidence.map(e => e.path),
            customerName: data.customerId.full_name,
            designerName: data.designerId.full_name,
            customerId: data.customerId.id,
            designerId: data.designerId.id,
            ...(customerProfileImage && { customerImage: customerProfileImage }),
            ...(designerProfileImage && { designerImage: designerProfileImage }),
            ...(data.resolutionType && { resolutionType: data.resolutionType }),
            ...(data.resolution && { resolution: data.resolution }),
            currentService: service
        }
    }
}