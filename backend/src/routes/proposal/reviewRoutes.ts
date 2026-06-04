import { Router } from "express";
import { ReviewRepository } from "../../repositories/proposal/reviewRepository.js";
import { ReviewService } from "../../services/proposal/reviewService.js";
import { UserRepository } from "../../repositories/auth/userRepository.js";
import { ProposalRepository } from "../../repositories/proposal/proposalRepository.js";
import { ReviewController } from "../../controllers/proposal/reviewController.js";
import customerAuthentication from "../../middlewares/customerAuth.js";
import authenticate from "../../middlewares/auth.js";

const router = Router()


const reviewRepo = new ReviewRepository()
const proposalRepo = new ProposalRepository()
const userRepo = new UserRepository()
const reviewService = new ReviewService(reviewRepo, proposalRepo, userRepo)
const reviewController = new ReviewController(reviewService)

router.post("/create",  customerAuthentication, reviewController.createReview)
router.get("/my/:id", authenticate, reviewController.getMyReviews)


export default router