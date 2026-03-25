import { Router } from "express";
import { UserManagementRepository } from "../repositories/admin/userManagementRepository.js";
import { AdminUserManagementService } from "../services/admin/userManagementService.js";
import { AdminController } from "../controllers/AdminController.js";
import adminAuthentication from "../middlewares/adminAuth.js";
import { DesignerVerificationManagementRepository } from "../repositories/admin/designerVerificationRepository.js";
import { AdminDesignerVerificationservice } from "../services/admin/designerVerificationService.js";
import { UserRepository } from "../repositories/auth/userRepository.js";


const router = Router()
// repos
const userManagementRepository = new UserManagementRepository()
const designerVerificationRepository = new DesignerVerificationManagementRepository()
const userRepo = new UserRepository()
// services
const userManagementServices = new AdminUserManagementService(userManagementRepository)
const designerVerificationServices = new AdminDesignerVerificationservice(designerVerificationRepository, userRepo);

const admincontroller = new AdminController(userManagementServices,designerVerificationServices)


// user Management
router.get("/users", adminAuthentication, admincontroller.getUsers)
router.get("/users/:id", adminAuthentication, admincontroller.getUser)
router.patch("/users/toggle-status/:id", adminAuthentication, admincontroller.toggleUser)

// designer Verifications
router.get("/designer-requests", adminAuthentication, admincontroller.getAllDesignerRequests)
router.get("/designer-requests/:id", admincontroller.getDesignerRequest)
router.patch("/designer-requests/status/:id", admincontroller.acceptOrRejectDesignerRequest)

export default router