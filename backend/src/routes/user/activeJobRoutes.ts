import { Router } from "express";
import { ActiveJobRepository } from "../../repositories/common/activeJobRepository";
import { ActiveJobService } from "../../services/customer/activeJobService";
import { ActiveJobController } from "../../controllers/user/activeJobController";
import authenticate from "../../middlewares/auth";
import designerAuthentication from "../../middlewares/designerAuth";

const router = Router()

const activeJobRepo = new ActiveJobRepository()
const activeJobService = new ActiveJobService(activeJobRepo)
const activeJobController = new ActiveJobController(activeJobService)

router.get("/customer",  authenticate, activeJobController.getCustomerActiveJobs)
router.get("/designer", designerAuthentication, activeJobController.getDesignerActiveJobs)

export default router