import { Router } from "express"

import multer from "multer"
import { DesignerController } from "../controllers/designerController.js";
import { DesignerService } from "../services/designer/designerService.js";
import { DesignerRepository } from "../repositories/designer/designerRepository.js";
import { UserRepository } from "../repositories/auth/userRepository.js";
import authenticate from "../middlewares/auth.js"
import { CloudinaryService } from "../services/common/cloudinaryService.js";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router()

const designerRepository = new DesignerRepository()
const userRepository = new UserRepository()

const imageUpload = new CloudinaryService()
const designerService = new DesignerService(userRepository, designerRepository, imageUpload)

const designerController = new DesignerController(designerService)

router.post("/designer-verification", authenticate, upload.fields([
    { name: "governmentIdImage", maxCount: 1 },
    { name: "educationImages", maxCount: 4 },
    { name: "workExperienceImages", maxCount: 4 },
]), designerController.designerVerificationController)


export default router