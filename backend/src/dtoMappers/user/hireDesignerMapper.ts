import type { getHireDesignerPerDesignResponseDTO, getMyHireDesignerRequestResponseDTO, HireDesignerPopulatedALL, HireDesignerPopulateUser } from "../../DTO/user/hireDesignerDTO.js";


export class HireDesignerMapper {
    static toGetMyHireDesignerRequestDTOlist(hireDesigner: HireDesignerPopulatedALL[]): getMyHireDesignerRequestResponseDTO[] {
        return hireDesigner.map(data => ({
            id: data.id,
            designId: data.designId.id,
            designerId: data.designId.userId.toString(),
            ...(data.rejectionReason && { rejectionReason: data.rejectionReason }),
            status: data.status,
            timeLine: data.timeLine,
            spaceType: data.spaceType,
            services: data.services,
            length: data.length,
            width: data.width,
            ...(data.ceilingHeight && { ceilingHeight: data.ceilingHeight }),
            ...(data.notes && { notes: data.notes }),
            unit: data.unit,
            coverImage: data.designId.coverImage.path,
            designName: data.designId.name,
            createdOn: data.createdAt.toDateString()

        }))
    }
    
    static toGetHireDesignerPerDesignDTOlist(hireDesigner: HireDesignerPopulateUser[]): getHireDesignerPerDesignResponseDTO[] {
        return hireDesigner.map(data => {
            const profileImage = data.userId.profileImage?.path ?? data.userId.profile_image_url;

            return {
                id: data.id,
                ...(data.rejectionReason && { rejectionReason: data.rejectionReason }),
                status: data.status,
                timeLine: data.timeLine,
                spaceType: data.spaceType,
                services: data.services,
                length: data.length,
                width: data.width,
                ...(data.ceilingHeight && { ceilingHeight: data.ceilingHeight }),
                ...(data.notes && { notes: data.notes }),
                unit: data.unit,
                createdOn: data.createdAt.toDateString(),
                userName: data.userId.id,
                ...(profileImage && { profileImage }),
            };
        });
    }
}

