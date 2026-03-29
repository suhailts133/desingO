import { Router } from "express";
import multer from "multer";
import designerAuthentication from "../middlewares/designerAuth.js";
import { DesignController } from "../controllers/designController.js";
import { DesignService } from "../services/designer/designService.js";
import { DesignRepository } from "../repositories/designer/designRepository.js";
import { CloudinaryService } from "../services/others/cloudinaryService.js";
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
router.get("/my-designs", designerAuthentication, designController.getAllDesigns)
router.get("/designs/:id", designController.getDesignDetail)
router.get("/designs", designController.getAllDesignsCommon)
router.delete("/designs/:id", designerAuthentication, designController.deleteADesign)

export default router