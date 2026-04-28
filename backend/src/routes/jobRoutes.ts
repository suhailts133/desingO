import { Router } from "express";
import authenticate from "../middlewares/auth.js";
import { JobController } from "../controllers/JobController.js";
import { JobRequestService } from "../services/customer/jobRequestService.js";
import { JobRequestRepository } from "../repositories/customer/jobRequestRepository.js";
import multer from "multer";
import { CloudinaryService } from "../services/common/cloudinaryService.js";
const upload = multer({ storage: multer.memoryStorage() });


// refrenceImages
const router = Router()

const jobRequestRepo = new JobRequestRepository()
const imageUpload = new CloudinaryService()
const jobrequestService = new JobRequestService(jobRequestRepo, imageUpload)
const jobController = new JobController(jobrequestService)

router.post("/post-job", authenticate, upload.fields([
    { name: "refrenceImages", maxCount: 10 },
]), jobController.postJobRequest)
router.patch("/edit-job/:id", authenticate, upload.fields([
    { name: "referenceImages", maxCount: 10 },
]), jobController.editJobRequest)
router.get("/my", authenticate, jobController.getMyJobs)
router.get("/:id", jobController.getJobDetails)
router.get("/", jobController.getAllJobs)
router.delete("/:id", authenticate, jobController.deleteAJob)
export default router