import { Router } from "express";
import authenticate from "../../middlewares/auth.js";
import { JobController } from "../../controllers/user/JobController.js";
import { JobRequestService } from "../../services/customer/jobRequestService.js";
import { JobRequestRepository } from "../../repositories/customer/jobRequestRepository.js";
import multer from "multer";
import { CloudinaryService } from "../../services/common/cloudinaryService.js";
const upload = multer({ storage: multer.memoryStorage() });



const router = Router()

const jobRequestRepo = new JobRequestRepository()
const imageUpload = new CloudinaryService()
const jobrequestService = new JobRequestService(jobRequestRepo, imageUpload)
const jobController = new JobController(jobrequestService)

router.get("/", jobController.getAllJobs)
router.post("/post-job", authenticate, upload.fields([
    { name: "refrenceImages", maxCount: 10 },
]), jobController.postJobRequest)
router.get("/my", authenticate, jobController.getMyJobs)
router.patch("/edit-job/:id", authenticate, upload.fields([
    { name: "referenceImages", maxCount: 10 },
]), jobController.editJobRequest)
router.get("/:id", jobController.getJobDetails)
router.delete("/:id", authenticate, jobController.deleteAJob)
export default router