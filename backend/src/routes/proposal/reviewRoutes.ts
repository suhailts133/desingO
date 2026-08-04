import { Router } from "express";
import { ReviewRepository } from "../../repositories/proposal/reviewRepository";
import { ReviewService } from "../../services/proposal/reviewService";
import { UserRepository } from "../../repositories/auth/userRepository";
import { ProposalRepository } from "../../repositories/proposal/proposalRepository";
import { ReviewController } from "../../controllers/proposal/reviewController";
import customerAuthentication from "../../middlewares/customerAuth";
import authenticate from "../../middlewares/auth";

const router = Router()


const reviewRepo = new ReviewRepository()
const proposalRepo = new ProposalRepository()
const userRepo = new UserRepository()
const reviewService = new ReviewService(reviewRepo, proposalRepo, userRepo)
const reviewController = new ReviewController(reviewService)

router.post("/create",  customerAuthentication, reviewController.createReview)
router.get("/my/:id", authenticate, reviewController.getMyReviews)


export default router