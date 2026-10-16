import { Router } from "express";
import { ActiveJobRepository } from "../../repositories/common/activeJobRepository";
import { ActiveJobService } from "../../services/customer/activeJobService";
import { ActiveJobController } from "../../controllers/user/activeJobController";
import designerAuthentication from "../../middlewares/designerAuth";
import customerAuthentication from "../../middlewares/customerAuth";

const router = Router()

const activeJobRepo = new ActiveJobRepository()
const activeJobService = new ActiveJobService(activeJobRepo)
const activeJobController = new ActiveJobController(activeJobService)

router.get("/customer",  customerAuthentication, activeJobController.getCustomerActiveJobs)
router.get("/designer", designerAuthentication, activeJobController.getDesignerActiveJobs)

export default router