import { Router } from "express";
import { HireDesignerRepository } from "../../repositories/customer/hireDesignerRepository";
import { HireDesignerService } from "../../services/customer/hireDesignerService";
import { DesignRepository } from "../../repositories/designer/designRepository";
import { HireDesignerController } from "../../controllers/user/hireDesignerController";
import { ActiveJobRepository } from "../../repositories/common/activeJobRepository";
import customerAuthentication from "../../middlewares/customerAuth";
import designerAuthentication from "../../middlewares/designerAuth";


const router = Router()

const hireDesignerRepo = new HireDesignerRepository()
const designRepo = new DesignRepository()
const activeJobRepo = new ActiveJobRepository()
const hireDesignerService = new HireDesignerService(hireDesignerRepo, designRepo, activeJobRepo)
const hireDesignerController = new HireDesignerController(hireDesignerService)

router.post("/create", customerAuthentication,  hireDesignerController.hireDesigner)
router.get("/my",customerAuthentication, hireDesignerController.getMyHireDesignerRequests)
router.get("/design/requests/:id", designerAuthentication, hireDesignerController.getRequestPerDesign)

export default router