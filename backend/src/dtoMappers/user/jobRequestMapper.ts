import type { JobDetailResponseDTO, JobsCommonResponseDTO, JobsResponseDTO } from "../../DTO/user/jobsDTO.js";
import type { IJobRequest, IJobRequestPopulated } from "../../interfaces/customer/ICustomer.js";

export class JobRequestMapper {
    static toMyJobRequestsDTOlist(jobRequests: IJobRequest[]): JobsResponseDTO[] {
        return jobRequests.map(data => ({
            id: data.id,
            projectTitle: data.projectTitle,
            propertyType: data.propertyType,
            status: data.status,
            state: data.state,
            district: data.district,
            city: data.state,
            minBudget: data.minBudget,
            maxBudget: data.maxBudget,
            description: data.description,
            rooms: data.rooms.length,
            timeLine: data.timeline
        }))
    }

    static toJobRequestsDTOlist(jobRequests: IJobRequestPopulated[]): JobsCommonResponseDTO[] {
        return jobRequests.map(data => ({
            id: data.id,
            projectTitle: data.projectTitle,
            propertyType: data.propertyType,
            designStyles: data.designStyles,
            minBudget: data.minBudget,
            maxBudget: data.maxBudget,
            name: data.userId.full_name,
            state: data.state,
            district: data.district,
            city: data.city,
            description: data.description,
            createdAt: data.createdAt.toDateString(),
            timeLine: data.timeline,
            rooms: data.rooms.length
        }))
    }

    static toJobRequestDTO(data:IJobRequestPopulated):JobDetailResponseDTO{
        return {
            id: data.id,
            projectTitle: data.projectTitle,
            propertyType: data.propertyType,
            designStyles: data.designStyles,
            state: data.state,
            district: data.district,
            city: data.city,
            phone: data.phone,
            timeline: data.timeline,
            minBudget: data.minBudget,
            maxBudget: data.maxBudget,
            description: data.description,
            referenceImages: data.referenceImages,
            rooms: data.rooms,
            status: data.status,
            name: data.userId.full_name,
            createdAt: data.createdAt.toDateString(),
            userCreatedAt: data.userId.createdAt.toDateString()
        }
    }
}