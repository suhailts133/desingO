import type { AdminDesignerApprovalDTO, AdminDesignerRequestResponseDTO, AdminDesignersResponseDTO } from "../../DTO/admin/adminDTO";
import type { DesignerCardDTO } from "../../DTO/designer/designerDTO";
import type { IDesignerPopulated } from "../../interfaces/designer/IDesigner";

export class DesignerMapper {
    static toDesingerDtoList(designers: IDesignerPopulated[]): AdminDesignersResponseDTO[] {
        return designers.map(designer => ({
            id: designer._id.toString(),
            full_name: designer.userId.full_name,
            status: designer.status,
            createdAt: designer.createdAt.toLocaleDateString(),
        }))
    }
    static toDesignerDetailDto(designer: IDesignerPopulated): AdminDesignerRequestResponseDTO {
        return {
            id: designer.id,
            full_name: designer.userId.full_name,
            userId: designer.userId.id,
            status: designer.status,
            govtIdType: designer.governmentIdType,
            Portfolio: designer.portfolioUrl,
            govtIdImage: designer.govtIdImage.path,
            bio: designer.bio,
            rejectionReason: designer.rejectionReason ?? "",
            education: designer.education.map(data => ({
                institutionName: data.institutionName,
                courseName: data.courseName,
                completionYear: data.completionYear,
                certification: data.certification.path
            })),
            workExperience: designer.workExperience?.map(data => ({
                companyName: data.companyName,
                role: data.role,
                yearsOfExperience: data.yearsOfExperience,
                proof: data.proof.path
            })) ?? []
        }
    }

    static toDesignerApprovalOrRejectionDTO(data: IDesignerPopulated): AdminDesignerApprovalDTO {
        return {
            status: data.status as "Approved" | "Rejected",
            ...(data.rejectionReason && { rejectionReason: data.rejectionReason }),
            name: data.userId.full_name,
            email: data.userId.email,
            userId: data.userId.id
        }
    }

    static toDesignerCardDTOlist(designers: IDesignerPopulated[]): DesignerCardDTO[] {
        return designers.map(d => ({
            designerId: d.userId.id,
            full_name: d.userId.full_name,
            ...(d.userId.profileImage?.path && { profileImg: d.userId.profileImage.path }),
            ...(d.userId.profile_image_url && { google_profil_img: d.userId.profile_image_url }),
            bio: d.bio,
            joinedAt: d.createdAt.toDateString(),
            state: d.state,
            district: d.district,
        }))
    }
}