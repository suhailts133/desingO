import { Router } from "express";
import { JobApplicationRepository } from "../repositories/common/jobApplicationRepository.js";
import { JobApplicationService } from "../services/common/JobApplicationServices.js";
import { JobRequestRepository } from "../repositories/customer/jobRequestRepository.js";
import { JobApplicationController } from "../controllers/jobApplicationController.js";
import designerAuthentication from "../middlewares/designerAuth.js";
import authenticate from "../middlewares/auth.js";

const router = Router()

const jobApplicationRepo = new JobApplicationRepository()
const jobRequestRepo = new JobRequestRepository()
const jobApplicationservice = new JobApplicationService(jobApplicationRepo, jobRequestRepo)
const jobApplicationController = new JobApplicationController(jobApplicationservice);


router.post("/apply", designerAuthentication, jobApplicationController.applyForJob)
router.patch("/approve-reject/:id", authenticate, jobApplicationController.approveOrRejectJobApplication)
router.delete("/:id", designerAuthentication, jobApplicationController.deleteJobApplication)
router.get("/my", designerAuthentication, jobApplicationController.getMyJobApplications)
router.get("/", authenticate, jobApplicationController.getAllJobApplications)
export default router