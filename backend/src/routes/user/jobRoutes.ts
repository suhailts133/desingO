import { Router } from "express";
import authenticate from "../../middlewares/auth";
import { JobController } from "../../controllers/user/JobController";
import { JobRequestService } from "../../services/customer/jobRequestService";
import { JobRequestRepository } from "../../repositories/customer/jobRequestRepository";
import multer from "multer";
import { CloudinaryService } from "../../services/common/cloudinaryService";
import { ActiveJobRepository } from "../../repositories/common/activeJobRepository";
import designerAuthentication from "../../middlewares/designerAuth";
const upload = multer({ storage: multer.memoryStorage() });



const router = Router()

const jobRequestRepo = new JobRequestRepository()
const activeJobrepo = new ActiveJobRepository()
const imageUpload = new CloudinaryService()
const jobrequestService = new JobRequestService(jobRequestRepo, imageUpload, activeJobrepo)
const jobController = new JobController(jobrequestService)

router.get("/", jobController.getAllJobs)
router.post("/post-job", authenticate, upload.fields([
    { name: "referenceImages", maxCount: 10 },
    { name: "floorPlans", maxCount: 10 }
]), jobController.postJobRequest)
router.patch("/accept-reject", designerAuthentication, jobController.acceptOrRejectHireRequest)
router.get("/my", authenticate, jobController.getMyJobs)
router.patch("/edit-job/:id", authenticate, upload.fields([
    { name: "referenceImages", maxCount: 10 },
    { name: "floorPlans", maxCount: 10 }
]), jobController.editJobRequest)

router.get("/design/request/:id", jobController.getRequestPerDesign)
router.get("/:id", jobController.getJobDetails)
router.delete("/:id", authenticate, jobController.deleteAJob)
export default router