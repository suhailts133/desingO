import mongoose from "mongoose";
import type { ReviewRepoDTO } from "../../DTO/proposal/review";
import type { IReview } from "../../interfaces/proposal/IProposal";
import type { IReviewRepository } from "../../interfaces/proposal/IProposalRepository";
import { ReviewModel } from "../../models/proposal/ReviewModal";
import { BaseRepository } from "../baseRepository";
import type { Pagination } from "../../DTO/admin/adminDTO";
import Logger from "../../config/logger";

export class ReviewRepository extends BaseRepository<IReview> implements IReviewRepository {
    constructor() {
        super(ReviewModel)
    }

    async getAllReviews(designerId: string): Promise<IReview[]> {
        return await this.find({ designerId })
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
        return await this.findOne({ jobId, userId })
    }

    async createReview(data: ReviewRepoDTO): Promise<IReview> {
        Logger.info("Repo hit")
        Logger.info(`${JSON.stringify(data)} from repo`)
        return await this.create({
            ...data,
            userId: new mongoose.Types.ObjectId(data.userId),
            designerId: new mongoose.Types.ObjectId(data.designerId),
            jobId: new mongoose.Types.ObjectId(data.jobId),
        })
    }
}