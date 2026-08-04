import { Router } from "express";
import multer from "multer";
import designerAuthentication from "../../middlewares/designerAuth";
import { DesignController } from "../../controllers/designer/designController";
import { DesignService } from "../../services/designer/designService";
import { DesignRepository } from "../../repositories/designer/designRepository";
import { CloudinaryService } from "../../services/common/cloudinaryService";
import optionalAuth from "../../middlewares/optionalAuth";
import { UserRepository } from "../../repositories/auth/userRepository";
import { DesignBenchMarkRepository } from "../../repositories/benchmarks/designBenchMarkRepository";
const upload = multer({ storage: multer.memoryStorage() });

const router = Router()

const designRepo = new DesignRepository()
const imageUpload = new CloudinaryService()
const userRepository = new UserRepository()
const designBenchMarkRepo = new DesignBenchMarkRepository()

const designService = new DesignService(designRepo, imageUpload, userRepository,designBenchMarkRepo)
const designController = new DesignController(designService)

router.post("/add-design", designerAuthentication, upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
]), designController.addDesign)

router.get("/my", designerAuthentication, designController.getMyDesigns)

router.get("/all-designs", optionalAuth, designController.getAllDesigns)

router.patch("/edit-design/:id", designerAuthentication, upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
]), designController.editDesign)

router.get("/gallary/:id", designController.getDesignGallery)

router.get("/:id", optionalAuth, designController.getDesignDetail)

router.delete("/:id", designerAuthentication, designController.deleteDesign)

export default router