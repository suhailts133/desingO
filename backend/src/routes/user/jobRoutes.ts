import { Router } from "express";
import authenticate from "../../middlewares/auth";
import { JobController } from "../../controllers/user/JobController";
import { JobRequestService } from "../../services/customer/jobRequestService";
import { JobRequestRepository } from "../../repositories/customer/jobRequestRepository";
import multer from "multer";
import { CloudinaryService } from "../../services/common/cloudinaryService";
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