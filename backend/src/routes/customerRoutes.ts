import { Router } from "express";
import authenticate from "../middlewares/auth.js";
import { CustomerController } from "../controllers/CustomerController.js";
import { JobRequestService } from "../services/customer/jobRequestService.js";
import { JobRequestRepository } from "../repositories/customer/jobRequestRepository.js";


const router = Router()

const jobRequestRepo = new JobRequestRepository()
const jobrequestService = new JobRequestService(jobRequestRepo)
const customerController = new CustomerController(jobrequestService)

router.post("/post-job", authenticate, customerController.addJobRequest)
router.get("/my-jobs", authenticate, customerController.getAllJobs)
router.get("/jobs/:id", customerController.getAJob)
router.get("/jobs", customerController.getAllJobsCommon)
router.delete("/jobs/:id", authenticate, customerController.deleteAJob)
export default router