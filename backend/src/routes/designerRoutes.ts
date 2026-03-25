import { Router } from "express"

import multer from "multer"
import { DesignerController } from "../controllers/designerController.js";
import { DesignerService } from "../services/designer/designerService.js";
import { DesignerRepository } from "../repositories/designer/designerRepository.js";
import { UserRepository } from "../repositories/auth/userRepository.js";
import authenticate from "../middlewares/auth.js"
import designerAuthentication from "../middlewares/designerAuth.js";
import { DesignRepository } from "../repositories/designer/designRepository.js";
import { CloudinaryService } from "../services/others/cloudinaryService.js";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router()

const designerRepository = new DesignerRepository()
const userRepository = new UserRepository()
const designRepo = new DesignRepository()
const imageUpload = new CloudinaryService()
const designerService = new DesignerService(userRepository, designerRepository, designRepo, imageUpload)
const designerController = new DesignerController(designerService)

router.post("/designer-verification", authenticate, upload.fields([
    { name: "governmentIdImage", maxCount: 1 },
    { name: "educationImages", maxCount: 4 },
    { name: "workExperienceImages", maxCount: 4 },
]), designerController.designerVerificationController)

router.post("/add-design", designerAuthentication, upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
]), designerController.addDesign)
router.get("/my-designs", designerAuthentication, designerController.getAllDesigns)
router.get("/designs/:id", designerController.getDesignDetail)
router.get("/designs", designerController.getAllDesignsCommon)
router.delete("/designs/:id", designerAuthentication, designerController.deleteADesign)
export default router