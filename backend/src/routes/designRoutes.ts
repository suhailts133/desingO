import { Router } from "express";
import multer from "multer";
import designerAuthentication from "../middlewares/designerAuth.js";
import { DesignController } from "../controllers/designController.js";
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
router.patch("/edit-design/:id", designerAuthentication, upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
]), designController.editDesign)
router.get("/my", designerAuthentication, designController.getAllDesigns)
router.get("/:id", designController.getDesignDetail)
router.get("/all-designs", designController.getAllDesignsCommon)
router.delete("/:id", designerAuthentication, designController.deleteADesign)
router.get("/gallary/:id", designController.getDesignGallary)
export default router