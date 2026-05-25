import { Router } from "express";
import { JobApplicationRepository } from "../../repositories/common/jobApplicationRepository.js";
import { JobApplicationService } from "../../services/common/JobApplicationServices.js";
import { JobRequestRepository } from "../../repositories/customer/jobRequestRepository.js";
import { JobApplicationController } from "../../controllers/designer/jobApplicationController.js";
import designerAuthentication from "../../middlewares/designerAuth.js";
import authenticate from "../../middlewares/auth.js";
import { ActiveJobRepository } from "../../repositories/common/activeJobRepository.js";

const router = Router()

const jobApplicationRepo = new JobApplicationRepository()
const jobRequestRepo = new JobRequestRepository()
const activeJobRepo = new ActiveJobRepository()
const jobApplicationservice = new JobApplicationService(jobApplicationRepo, jobRequestRepo, activeJobRepo)
const jobApplicationController = new JobApplicationController(jobApplicationservice);


router.post("/apply", designerAuthentication, jobApplicationController.applyForJob)
router.get("/my", designerAuthentication, jobApplicationController.getMyJobApplications)
router.patch("/approve-reject/:id", authenticate, jobApplicationController.approveOrRejectJobApplication)
router.get("/:id", authenticate, jobApplicationController.getJobApplications)
router.delete("/:id", designerAuthentication, jobApplicationController.deleteJobApplication)
export default router