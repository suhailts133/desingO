import type { ReviewListDTO } from "../../DTO/proposal/review";
import type { IReview } from "../../interfaces/proposal/IProposal";

export class ReviewMapper {
    static toReviewDTOList(data: IReview[]): ReviewListDTO[] {
        return data.map(d => ({
            comment: d.comment,
            rating: d.rating,
            userName: d.userName,
            ...(d.profileImage && { profileImage: d.profileImage }),
            createdAt: d.createdAt.toDateString()

        }))
    }
}