import { Router } from "express";
import { ActiveJobRepository } from "../../repositories/common/activeJobRepository.js";
import { ActiveJobService } from "../../services/customer/activeJobService.js";
import { ActiveJobController } from "../../controllers/user/activeJobController.js";
import authenticate from "../../middlewares/auth.js";
import designerAuthentication from "../../middlewares/designerAuth.js";

const router = Router()

const activeJobRepo = new ActiveJobRepository()
const activeJobService = new ActiveJobService(activeJobRepo)
const activeJobController = new ActiveJobController(activeJobService)

router.get("/customer",  authenticate, activeJobController.getCustomerActiveJobs)
router.get("/designer", designerAuthentication, activeJobController.getDesignerActiveJobs)

export default router