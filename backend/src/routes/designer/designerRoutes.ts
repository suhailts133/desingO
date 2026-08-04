import { Router } from "express"
import multer from "multer"
import { DesignerController } from "../../controllers/designer/designerController";
import { DesignerService } from "../../services/designer/designerService";
import { DesignerRepository } from "../../repositories/designer/designerRepository";
import { UserRepository } from "../../repositories/auth/userRepository";
import authenticate from "../../middlewares/auth"
import { CloudinaryService } from "../../services/common/cloudinaryService";

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
]), designerController.designerVerification)

router.get("/", designerController.getAllDesigners)
router.get("/:id", designerController.getADesigner)

export default router