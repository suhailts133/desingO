import { Router } from "express";
import { HireDesignerRepository } from "../../repositories/customer/hireDesignerRepository.js";
import { HireDesignerService } from "../../services/customer/hireDesignerService.js";
import { DesignRepository } from "../../repositories/designer/designRepository.js";
import { HireDesignerController } from "../../controllers/user/hireDesignerController.js";
import { ActiveJobRepository } from "../../repositories/common/activeJobRepository.js";


const router = Router()

const hireDesignerRepo = new HireDesignerRepository()
const designRepo = new DesignRepository()
const activeJobRepo = new ActiveJobRepository()
const hireDesignerService = new HireDesignerService(hireDesignerRepo, designRepo, activeJobRepo)
const hireDesignerController = new HireDesignerController(hireDesignerService)

router.get("/request", hireDesignerController.createDesigner)
router.get("/my", hireDesignerController.getMyHireDesignerRequests)
router.get("/design/requests", hireDesignerController.getRequestPerDesign)

export default router