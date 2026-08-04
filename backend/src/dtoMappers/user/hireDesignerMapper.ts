
import type { getHireDesignerPerDesignResponseDTO, getMyHireDesignerRequestResponseDTO, HireDesignerPopulatedALL, HireDesignerPopulateUser } from "../../DTO/user/hireDesignerDTO";


export class HireDesignerMapper {

    // static toDirectHireProposalInputDTO(data: IHireDesigner): ProposalInputData {
    //     return {
    //         jobId: data.id,
    //         maxPrice: data.maxPrice,
    //         minPrice: data.minPrice,
    //         services: data.services,
    //         timeLine:data.timeLine,
    //         sqft: toSqFt(Number(data.length), Number(data.width), data.unit)

    //     }
    // }
    static toGetMyHireDesignerRequestDTOlist(hireDesigner: HireDesignerPopulatedALL[]): getMyHireDesignerRequestResponseDTO[] {
        return hireDesigner.map(data => ({
            id: data.id,
            designId: data.designId.id,
            ...(data.rejectionReason && { rejectionReason: data.rejectionReason }),
            status: data.status,
            timeLine: data.timeLine,
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

