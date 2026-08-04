import type { AllJobApplicationsDTO, JobApplicationApprovalOrRejectionResponseDTO, MyJobApplicationsDTO } from "../../DTO/designer/jobsDTO";
import type { IJobApplication, IJobApplicationPopulated, IJobApplicationPopulatedWithJobAndUser, JobApplicationApprovalOrRejectionStatus } from "../../interfaces/designer/IDesigner";

export class JobApplicationMapper {
    static toJobApplicationApprovalOrRejectionDTO(data: IJobApplication): JobApplicationApprovalOrRejectionResponseDTO {
        return {
            status: data.status as JobApplicationApprovalOrRejectionStatus,
            ...(data.rejectionReason && { rejectionReason: data.rejectionReason }),
            jobId: data.id.toString()
        }
    }
    static toMyJobApplicationDTOlist(jobApplication: IJobApplicationPopulated[]): MyJobApplicationsDTO[] {
        return jobApplication.map(data => ({
            id: data.id,
            status: data.status,
            ...(data.rejectionReason && { rejectionReason: data.rejectionReason }),
            jobId: data.jobId.id,
            jobTitle: data.jobId.projectTitle,
            propertyType: data.jobId.propertyType,
            timeLine: data.jobId.timeline,
            numberOfRooms: data.jobId.rooms.length,
            description: data.jobId.description,
            createdOn: data.createdAt.toDateString()
        }))
    }
    static toJobApplicationDTOList(jobApplicatoin: IJobApplicationPopulatedWithJobAndUser[]): AllJobApplicationsDTO[] {
        return jobApplicatoin.map(data => ({
            status: data.status,
            jobId: data.jobId.id,
            jobTitle: data.jobId.projectTitle,
            designerId: data.designerId.id,
            designerName: data.designerId.full_name,
            ...(data.rejectionReason && { rejectionReason: data.rejectionReason }),
            propertyType: data.jobId.propertyType,
            timeLine: data.jobId.timeline,
            id: data.id,
            createdOn:data.createdAt.toDateString()
        }))
    }
}