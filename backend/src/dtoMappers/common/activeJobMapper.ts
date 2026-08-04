import type { ActiveJobPopulated, ActiveJobResponseDTO } from "../../DTO/user/activeJobDTO";

export class ActiveJobMapper {
    static toCustomerActiveJobDTOlist(data: ActiveJobPopulated[], type: "Customer" | "Designer"): ActiveJobResponseDTO[] {
        return data.map(d => ({
            sourceType: d.sourceType,
            sourceName: d.sourceName,
            sourceId: d.sourceId.toString(),
            userName: type !== "Designer" ? d.designerId.full_name : d.userId.full_name,
            id: d.id,
            proposalStatus: d.proposalStatus,
            status: d.status,
            startedAt: d.startedAt.toDateString(),
            ...((type !== "Designer" ? (d.designerId.profileImage?.path ?? d.designerId.profile_image_url) : (d.userId.profileImage?.path ?? d.userId.profile_image_url)) && {
                profileImage: type !== "Designer" ? (d.designerId.profileImage?.path ?? d.designerId.profile_image_url) : (d.userId.profileImage?.path ?? d.userId.profile_image_url)
            })
        }))
    }
}