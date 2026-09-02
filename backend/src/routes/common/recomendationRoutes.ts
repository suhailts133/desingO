import { Router } from "express";
import optionalAuth from "../../middlewares/optionalAuth";
import { RecomendationController } from "../../controllers/common/recomendationController";
import { DesignRecomendationService } from "../../services/customer/designRecommendationService";
import { UserRepository } from "../../repositories/auth/userRepository";
import { designService } from "../designer/designRoutes";
import { CustomerInteractionRepository } from "../../repositories/customer/customerInteractionRepository";
import { DesignRepository } from "../../repositories/designer/designRepository";
const router = Router()


const userRepo = new UserRepository()
const interactiionRepo = new CustomerInteractionRepository()
const designRepo = new DesignRepository()
const designRecomendationService = new DesignRecomendationService(userRepo, interactiionRepo, designRepo)

const recomendationController = new RecomendationController(designRecomendationService, designService)

router.get("/designs", optionalAuth, recomendationController.recomendDesigns)


export default router