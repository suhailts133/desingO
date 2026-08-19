import type { ProposalInputData } from "../../DTO/proposal/proposal";
import type { HireDesignerDTO, JobDetailResponseDTO, JobsCommonResponseDTO, JobsResponseDTO } from "../../DTO/user/jobsDTO";
import type { IJobRequest, IJobRequestCustomerPopulated, IJobRequestPopulated } from "../../interfaces/customer/ICustomer";

export class JobRequestMapper {

    static toJobRequestProposalInputDTO(jobRequest: IJobRequestPopulated): ProposalInputData {


        return {
            jobId: jobRequest.id,
            services: jobRequest.services,
            maxPrice: jobRequest.maxBudget,
            minPrice: jobRequest.maxBudget,
            timeLine: jobRequest.timeline,
            sqft: jobRequest.totalCarpetArea
        }
    }

    static toMyJobRequestsDTOlist(jobRequests: IJobRequest[]): JobsResponseDTO[] {
        return jobRequests.map(data => ({
            id: data.id,
            projectTitle: data.projectTitle,
            propertyType: data.propertyType,
            sourceType: data.sourceType,
            status: data.status,
            state: data.state,
            district: data.district,
            city: data.state,
            minBudget: data.minBudget,
            maxBudget: data.maxBudget,
            description: data.description,
            rooms: data.selectedRooms.length,
            timeLine: data.timeline
        }))
    }

    static toHireRequestDTOList(jobRequests: IJobRequestCustomerPopulated[]): HireDesignerDTO[] {
        return jobRequests.map(data => {
            const profileImage = data.userId.profileImage?.path ?? data.userId.profile_image_url;

            return {
                id: data.id,
                userId: data.userId.id,
                userName: data.userId.full_name,
                ...(data.rejectionReason && { rejectionReason: data.rejectionReason }),
                ...(profileImage && { profileImage }),
                totalArea: data.totalCarpetArea,
                rooms: data.selectedRooms.length,
                areaUnit: data.areaUnit,
                projectTitle: data.projectTitle,
                maxBudget: data.maxBudget,
                minBudget: data.minBudget,
                projectType: data.projectType,
                createdAt: data.createdAt.toDateString(),
                timeLine: data.timeline,
                status: data.status,
            }
        })
    }
    static toJobRequestsDTOlist(jobRequests: IJobRequestPopulated[]): JobsCommonResponseDTO[] {
        return jobRequests.map(data => ({
            id: data.id,
            projectTitle: data.projectTitle,
            propertyType: data.propertyType,
            designStyles: data.designStyles,
            minBudget: data.minBudget,
            maxBudget: data.maxBudget,
            sourceType: data.sourceType,
            name: data.userId.full_name,
            state: data.state,
            district: data.district,
            city: data.city,
            description: data.description,
            createdAt: data.createdAt.toDateString(),
            timeLine: data.timeline,
            rooms: data.selectedRooms.length
        }))
    }

    static toJobRequestDTO(data: IJobRequestPopulated): JobDetailResponseDTO {
        return {
            id: data.id,
            projectTitle: data.projectTitle,
            propertyType: data.propertyType,
            projectType: data.projectType,
            sourceType: data.sourceType,

            ...(data.designId && { designId: data.designId.toString() }),
            ...(data.designerId && { designerId: data.designerId.id }),
            ...(data.designerId && { designerName: data.designerId.full_name }),

            userId: data.userId.id,
            userName: data.userId.full_name,

            totalCarpetArea: data.totalCarpetArea,
            areaUnit: data.areaUnit,
            selectedRooms: data.selectedRooms,
            floorPlans: data.floorPlans,
            requiresSiteVisitMeasurement: data.requiresSiteVisitMeasurement,

            renovationDetails: data.renovationDetails,
            newbuildDetails: data.newbuildDetails,

            designStyles: data.designStyles,
            preferredMaterials: data.preferredMaterials,
            services: data.services,
            description: data.description,
            referenceImages: data.referenceImages,
            householdProfile: data.householdProfile,

            state: data.state,
            district: data.district,
            city: data.city,
            pincode: data.pincode,
            phone: data.phone,

            timeline: data.timeline,
            minBudget: data.minBudget,
            maxBudget: data.maxBudget,

            status: data.status,
            createdAt: data.createdAt.toDateString()
        };
    }
}