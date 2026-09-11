import { Router } from "express";

import { UserController } from "../../controllers/admin/userController.js";
import adminAuthentication from "../../middlewares/adminAuth.js";
import { UserManagementRepository } from "../../repositories/admin/userManagementRepository.js";
import { AdminUserManagementService } from "../../services/admin/userManagementService.js";
import { ActiveJobRepository } from "../../repositories/common/activeJobRepository.js";
import { ReviewRepository } from "../../repositories/proposal/reviewRepository.js";
import { DesignRepository } from "../../repositories/designer/designRepository.js";


const router = Router()

const userManagementRepository = new UserManagementRepository()
const activeJobRepo = new ActiveJobRepository()
const reviewRepo = new ReviewRepository()
const designRepo = new DesignRepository()
const userManagementServices = new AdminUserManagementService(userManagementRepository,reviewRepo,activeJobRepo,designRepo)
const usercontroller = new UserController(userManagementServices)

router.get("/", adminAuthentication, usercontroller.getUsers)
router.patch("/toggle-status/:id", adminAuthentication, usercontroller.toggleUser)
router.get("/:id", adminAuthentication, usercontroller.getUser)

export default router