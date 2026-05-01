import { Router } from "express";
import multer from "multer";
import designerAuthentication from "../middlewares/designerAuth.js";
import { DesignController } from "../controllers/designer/designController.js";
import { DesignService } from "../services/designer/designService.js";
import { DesignRepository } from "../repositories/designer/designRepository.js";
import { CloudinaryService } from "../services/common/cloudinaryService.js";
const upload = multer({ storage: multer.memoryStorage() });

const router = Router()

const designRepo = new DesignRepository()
const imageUpload = new CloudinaryService()

const designService = new DesignService(designRepo, imageUpload)
const designController = new DesignController(designService)
router.post("/add-design", designerAuthentication, upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
]), designController.addDesign)

router.get("/my", designerAuthentication, designController.getMyDesigns)

router.get("/all-designs", designController.getAllDesigns)

router.patch("/edit-design/:id", designerAuthentication, upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
]), designController.editDesign)
router.get("/gallary/:id", designController.getDesignGallery)
router.delete("/:id", designerAuthentication, designController.deleteDesign)
router.get("/:id", designController.getDesignDetail)
export default router