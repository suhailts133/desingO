import { Router } from "express";
import authenticate from "../../middlewares/auth.js";
import { SavedDesignService } from "../../services/customer/savedDesignService.js";
import { SavedDesignRepository } from "../../repositories/customer/savedDesignRepository.js";
import { UserRepository } from "../../repositories/auth/userRepository.js";
import { DesignRepository } from "../../repositories/designer/designRepository.js";
import { SavedDesignController } from "../../controllers/user/savedDesignController.js";

const router = Router()

const savedDesignRepo = new SavedDesignRepository()
const userRepo = new UserRepository()
const designRepo = new DesignRepository()
const savedDesignService = new SavedDesignService(savedDesignRepo, userRepo, designRepo)
const savedDesignController = new SavedDesignController(savedDesignService)

router.patch("/add-or-remove", authenticate, savedDesignController.addOrRemoveDesign)
router.get("/my", authenticate, savedDesignController.getSavedDesigns)


export default router