import { Router } from "express";

import { UserController } from "../../controllers/admin/userController.js";
import adminAuthentication from "../../middlewares/adminAuth.js";
import { UserManagementRepository } from "../../repositories/admin/userManagementRepository.js";
import { AdminUserManagementService } from "../../services/admin/userManagementService.js";


const router = Router()

const userManagementRepository = new UserManagementRepository()
const userManagementServices = new AdminUserManagementService(userManagementRepository)
const usercontroller = new UserController(userManagementServices)

router.get("/", adminAuthentication, usercontroller.getUsers)
router.patch("/toggle-status/:id", adminAuthentication, usercontroller.toggleUser)
router.get("/:id", adminAuthentication, usercontroller.getUser)

export default router