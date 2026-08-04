import { Router } from "express";
import { HireDesignerRepository } from "../../repositories/customer/hireDesignerRepository";
import { HireDesignerService } from "../../services/customer/hireDesignerService";
import { DesignRepository } from "../../repositories/designer/designRepository";
import { HireDesignerController } from "../../controllers/user/hireDesignerController";
import { ActiveJobRepository } from "../../repositories/common/activeJobRepository";


const router = Router()

const hireDesignerRepo = new HireDesignerRepository()
const designRepo = new DesignRepository()
const activeJobRepo = new ActiveJobRepository()
const hireDesignerService = new HireDesignerService(hireDesignerRepo, designRepo, activeJobRepo)
const hireDesignerController = new HireDesignerController(hireDesignerService)

router.get("/create", hireDesignerController.createDesigner)
router.get("/my", hireDesignerController.getMyHireDesignerRequests)
router.get("/design/requests", hireDesignerController.getRequestPerDesign)

export default router