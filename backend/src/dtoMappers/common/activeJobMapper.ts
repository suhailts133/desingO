import type { ActiveJobPopulateAll, ActiveJobResponseDTO } from "../../DTO/user/activeJobDTO.js";

export class ActiveJobMapper {
    static toCustomerActiveJobDTOlist(data: ActiveJobPopulateAll[]): ActiveJobResponseDTO[] {
        return data.map(d => ({
            sourceType: d.sourceType,
            sourceName: d.sourceName,
            sourceId: d.sourceId.id,
            userName: d.designerId.full_name,
            id: d.id,
            status: d.status,
            startedAt: d.startedAt.toDateString(),
            ...((d.designerId.profileImage?.path ?? d.designerId.profile_image_url) && {
                profileImage: d.designerId.profileImage?.path ?? d.designerId.profile_image_url
            })
        }))
    }
}