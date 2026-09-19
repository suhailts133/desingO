import { Router } from "express";
import { DesingerVerificationController } from "../../controllers/admin/designerVerificationController";
import adminAuthentication from "../../middlewares/adminAuth";
import { DesignerVerificationManagementRepository } from "../../repositories/admin/designerVerificationRepository";
import { AdminDesignerVerificationservice } from "../../services/admin/designerVerificationService";
import { UserRepository } from "../../repositories/auth/userRepository";
import { MongooseTransactionManager } from "../../shared/helpers/MongooseTransactionManager";

const router = Router();
// repos
const designerVerificationRepository = new DesignerVerificationManagementRepository();
const userRepo = new UserRepository();
// services
const dbTransaction = new MongooseTransactionManager();
const designerVerificationServices = new AdminDesignerVerificationservice(designerVerificationRepository, userRepo, dbTransaction);
const designerVerificationController = new DesingerVerificationController(designerVerificationServices);

router.get("/", adminAuthentication, designerVerificationController.getAllDesignerApplication);
router.patch("/status/:id", adminAuthentication, designerVerificationController.acceptOrRejectDesignerApplication);
router.get("/:id", adminAuthentication, designerVerificationController.getDesignerApplicationDetail);

export default router;
