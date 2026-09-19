import { Router } from "express";
import { JobApplicationRepository } from "../../repositories/common/jobApplicationRepository";
import { JobApplicationService } from "../../services/common/JobApplicationServices";
import { JobRequestRepository } from "../../repositories/customer/jobRequestRepository";
import { JobApplicationController } from "../../controllers/designer/jobApplicationController";
import designerAuthentication from "../../middlewares/designerAuth";
import authenticate from "../../middlewares/auth";
import { ActiveJobRepository } from "../../repositories/common/activeJobRepository";
import { NotificationService } from "../../services/common/notificationService";
import { NotificationRepository } from "../../repositories/socket/notificationRepository";
import { MongooseTransactionManager } from "../../shared/helpers/MongooseTransactionManager";
const router = Router()

const jobApplicationRepo = new JobApplicationRepository()
const jobRequestRepo = new JobRequestRepository()
const activeJobRepo = new ActiveJobRepository()
const notificationRepo = new NotificationRepository()
export const notificationService = new NotificationService(notificationRepo)

const transactionManager = new MongooseTransactionManager()
const jobApplicationservice = new JobApplicationService(jobApplicationRepo, jobRequestRepo, activeJobRepo,notificationService,transactionManager)
const jobApplicationController = new JobApplicationController(jobApplicationservice);


router.post("/apply", designerAuthentication, jobApplicationController.applyForJob)
router.get("/my", designerAuthentication, jobApplicationController.getMyJobApplications)
router.patch("/approve-reject/:id", authenticate, jobApplicationController.approveOrRejectJobApplication)
router.get("/:id", authenticate, jobApplicationController.getJobApplications)
router.delete("/:id", designerAuthentication, jobApplicationController.deleteJobApplication)
export default router