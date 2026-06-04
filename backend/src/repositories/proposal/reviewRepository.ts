import mongoose from "mongoose";
import type { ReviewRepoDTO } from "../../DTO/proposal/review.js";
import type { IReview } from "../../interfaces/proposal/IProposal.js";
import type { IReviewRepository } from "../../interfaces/proposal/IProposalRepository.js";
import { ReviewModel } from "../../models/proposal/ReviewModal.js";
import { BaseRepository } from "../baseRepository.js";
import type { Pagination } from "../../DTO/admin/adminDTO.js";

export class ReviewRepository extends BaseRepository<IReview> implements IReviewRepository {
    constructor() {
        super(ReviewModel)
    }

    async getMyReviews(designerId: string, page?: string): Promise<{ data: IReview[]; pagination: Pagination; }> {
        const pageNO = page ? Number(page) : 1;
        const limit = 6

        const [result, total] = await Promise.all([
            this._model.find({ designerId })
                .skip((pageNO - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec(),
            this._model.countDocuments({ designerId })
        ])
        const pagination: Pagination = {
            total,
            totalPages: Math.ceil(total / limit)
        };

        return { data: result, pagination };
    }

  
    async alreadyExsits(jobId: string, userId: string): Promise<IReview | null> {
        return await this.findOne({jobId,userId})
    }

    async createReview(data: ReviewRepoDTO): Promise<IReview> {
        return await this.create({
            ...data,
            userId: new mongoose.Types.ObjectId(data.userId),
            designerId: new mongoose.Types.ObjectId(data.designerId),
            jobId: new mongoose.Types.ObjectId(data.jobId),
        })
    }
}