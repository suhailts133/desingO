import { Router } from "express";
import authenticate from "../../middlewares/auth";
import { SavedDesignService } from "../../services/customer/savedDesignService";
import { SavedDesignRepository } from "../../repositories/customer/savedDesignRepository";
import { UserRepository } from "../../repositories/auth/userRepository";
import { DesignRepository } from "../../repositories/designer/designRepository";
import { SavedDesignController } from "../../controllers/user/savedDesignController";

const router = Router()

const savedDesignRepo = new SavedDesignRepository()
const userRepo = new UserRepository()
const designRepo = new DesignRepository()
const savedDesignService = new SavedDesignService(savedDesignRepo, userRepo, designRepo)
const savedDesignController = new SavedDesignController(savedDesignService)

router.patch("/add-or-remove", authenticate, savedDesignController.addOrRemoveDesign)
router.get("/my", authenticate, savedDesignController.getSavedDesigns)


export default router