import { Router } from "express";
import { DesingerVerificationController } from "../../controllers/admin/designerVerificationController.js";
import adminAuthentication from "../../middlewares/adminAuth.js";
import { DesignerVerificationManagementRepository } from "../../repositories/admin/designerVerificationRepository.js";
import { AdminDesignerVerificationservice } from "../../services/admin/designerVerificationService.js";
import { UserRepository } from "../../repositories/auth/userRepository.js";


const router = Router()
// repos
const designerVerificationRepository = new DesignerVerificationManagementRepository()
const userRepo = new UserRepository()
// services
const designerVerificationServices = new AdminDesignerVerificationservice(designerVerificationRepository, userRepo);
const designerVerificationController = new DesingerVerificationController(designerVerificationServices)



router.get("/", adminAuthentication, designerVerificationController.getAllDesignerApplication)
router.patch("/status/:id", adminAuthentication, designerVerificationController.acceptOrRejectDesignerApplication)
router.get("/:id", adminAuthentication, designerVerificationController.getDesignerApplicationDetail)

export default router