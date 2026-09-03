import { Router } from "express";
import optionalAuth from "../../middlewares/optionalAuth";
import { RecomendationController } from "../../controllers/common/recomendationController";
import { DesignRecomendationService } from "../../services/customer/designRecommendationService";
import { UserRepository } from "../../repositories/auth/userRepository";
import { designService } from "../designer/designRoutes";
import { CustomerInteractionRepository } from "../../repositories/customer/customerInteractionRepository";
import { DesignRepository } from "../../repositories/designer/designRepository";
import { JobRequestRepository } from "../../repositories/customer/jobRequestRepository";
import { JobRecomendationService } from "../../services/designer/jobRecomendationService";
import { DesignerInteractionRepository } from "../../repositories/designer/designerInteractionRepository";
import { jobrequestService } from "../user/jobRoutes";
const router = Router()


const userRepo = new UserRepository()
const interactiionRepo = new CustomerInteractionRepository()
const designerInteractionRepo = new DesignerInteractionRepository()
const designRepo = new DesignRepository()
const jobRepo = new JobRequestRepository()
const designRecomendationService = new DesignRecomendationService(userRepo, interactiionRepo, designRepo)
const JobsRecomendationService = new JobRecomendationService(designerInteractionRepo, jobRepo)

const recomendationController = new RecomendationController(jobrequestService, JobsRecomendationService, designRecomendationService, designService)

router.get("/designs", optionalAuth, recomendationController.recomendDesigns)
router.get("/jobs", optionalAuth, recomendationController.recomendJobs)


export default router