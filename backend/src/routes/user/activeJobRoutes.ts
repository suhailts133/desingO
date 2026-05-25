import { Router } from "express";
import { ActiveJobRepository } from "../../repositories/common/activeJobRepository.js";
import { ActiveJobService } from "../../services/customer/activeJobService.js";
import { ActiveJobController } from "../../controllers/user/activeJobController.js";

const router = Router()

const activeJobRepo = new ActiveJobRepository()
const activeJobService = new ActiveJobService(activeJobRepo)
const activeJobController = new ActiveJobController(activeJobService)

router.get("/customer", activeJobController.getCustomerActiveJobs)
router.get("/designer", activeJobController.getCustomerActiveJobs)

export default router