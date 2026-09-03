import { Router } from "express";
import designerAuthentication from "../../middlewares/designerAuth";
import { DashboardController } from "../../controllers/common/dashboardController";
import { DesignerDashboardService } from "../../services/designer/designerDashboardService";
import { DisputeRepository } from "../../repositories/proposal/disputeRepository";
import { UserRepository } from "../../repositories/auth/userRepository";
import { ProposalRepository } from "../../repositories/proposal/proposalRepository";
import { ReviewRepository } from "../../repositories/proposal/reviewRepository";
import { ActiveJobRepository } from "../../repositories/common/activeJobRepository";
import { DesignRepository } from "../../repositories/designer/designRepository";
import { CustomerDashboardService } from "../../services/customer/customerDashboardService";
import customerAuthentication from "../../middlewares/customerAuth";
import { JobRequestRepository } from "../../repositories/customer/jobRequestRepository";

const router = Router()


const designRepo = new DesignRepository()
const disputeRepo = new DisputeRepository()
const userRepo = new UserRepository()
const proposalRepo = new ProposalRepository()
const reviewRepo = new ReviewRepository()
const activeJobRepo = new ActiveJobRepository()
const jobRepo = new JobRequestRepository()
const designerDashboardService = new DesignerDashboardService(designRepo, disputeRepo, userRepo, proposalRepo, reviewRepo, activeJobRepo)
const customerDashboardService = new CustomerDashboardService(jobRepo, disputeRepo, userRepo, proposalRepo, activeJobRepo)
const dashboardController = new DashboardController(designerDashboardService, customerDashboardService)

router.get("/designer", designerAuthentication, dashboardController.getDesignerDashboard)
router.get("/customer", customerAuthentication, dashboardController.getCustomerDashboard)

export default router