
import type { ProposalReviewDTO, ReviewListDTO, ReviewPayload, ReviewResponseDTO } from "../../DTO/proposal/review";
import { ReviewMapper } from "../../dtoMappers/proposal/reviewMapper";
import type { IUserRepository } from "../../interfaces/auth/IUserRepository";
import type { IApiResponse, IApiResponseWithPagination } from "../../interfaces/base/IApiResponse";
import type { IProposalRepository, IReviewRepository } from "../../interfaces/proposal/IProposalRepository";
import type { IReviewService } from "../../interfaces/proposal/IProposalService";
import { CONTRACT_STATUS } from "../../shared/enums/proposalEnums";
import { RESPONSE_CODE } from "../../shared/enums/statusCode";
import { AppError } from "../../shared/errors/appError";
import { AUTH_MESSAGES } from "../../shared/messages/authMessages";
import { PROPOSAL_MESSAGES } from "../../shared/messages/proposalMessages";

export class ReviewService implements IReviewService {
    constructor(private _reviewRepo: IReviewRepository, private _proposalRepo: IProposalRepository, private _userRepo: IUserRepository) {
    }

    async createReview(userId: string, data: ReviewPayload): Promise<IApiResponse<ReviewResponseDTO>> {
        const proposal = await this._proposalRepo.getProposal(data.sourceId)
        if (!proposal) {
            throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.NOT_FOUND, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        if (proposal.contractStatus !== CONTRACT_STATUS.COMPLETED && proposal.contractStatus !== CONTRACT_STATUS.TERMINATED) {
            throw new AppError(PROPOSAL_MESSAGES.REVIEW.NOT_ELIGIBLE, RESPONSE_CODE.FORBIDDEN)
        }
        const alreadyReviewed = await this._reviewRepo.alreadyExsits(data.sourceId, userId)
        if (alreadyReviewed) {
            throw new AppError(PROPOSAL_MESSAGES.REVIEW.ALREADY_REVIEWD, RESPONSE_CODE.CONFILT)
        }
        const user = await this._userRepo.findUserById(userId)
        if (!user) {
            throw new AppError(AUTH_MESSAGES.USER.NOT_FOUND, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        const profileImage = user.google_profile_id || user.profileImage?.path;
        const result = await this._reviewRepo.createReview({
            jobId: data.sourceId,
            rating: data.rating,
            comment: data.comment,
            userId,
            designerId: proposal.designerId.id,
            userName: user.full_name,
            ...(profileImage && { profileImage })
        })
        if (!result) {
            throw new AppError(PROPOSAL_MESSAGES.REVIEW.ERROR, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        const isReviewd = await this._proposalRepo.updateProposal(proposal.id, { isReviewd: true })
        if (!isReviewd) {
            throw new AppError(PROPOSAL_MESSAGES.PROPOSAL.UPDATE_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        const responseData: ReviewResponseDTO = {
            comment: result.comment,
            rating: result.rating
        }
        return { message: PROPOSAL_MESSAGES.REVIEW.SUCCESS, statuscode: RESPONSE_CODE.CREATED, data: responseData }
    }

    async getMyReviews(designerId: string, page?: string): Promise<IApiResponseWithPagination<ReviewListDTO[]>> {
        const { data, pagination } = await this._reviewRepo.getMyReviews(designerId, page)
        if (!data || !pagination) {
            throw new AppError(PROPOSAL_MESSAGES.REVIEW.FETCH_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        const reviewData = ReviewMapper.toReviewDTOList(data);
        return { message: PROPOSAL_MESSAGES.REVIEW.FETCH_ALL, data: reviewData, total: pagination.total, totalPages: pagination.totalPages }
    }


    async getMyTopReviews(designerId: string): Promise<IApiResponse<ReviewListDTO[]>> {
        const reviews = await this._reviewRepo.getMyTopReviews(designerId);
        const reviewData = ReviewMapper.toReviewDTOList(reviews)
        return { message: PROPOSAL_MESSAGES.REVIEW.TOP_REVIEWS, data: reviewData }
    }


    async getReviewPerJob(jobId: string): Promise<IApiResponse<ProposalReviewDTO>> {
        console.log("hit")
        const review = await this._reviewRepo.getReviewPerJob(jobId)
        if (!review) {
            throw new AppError(PROPOSAL_MESSAGES.REVIEW.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        const data: ProposalReviewDTO = {
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt.toLocaleDateString()
        }
        return { message: PROPOSAL_MESSAGES.REVIEW.FOUND, data }
    }

}