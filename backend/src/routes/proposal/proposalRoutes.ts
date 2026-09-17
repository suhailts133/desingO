import { Router } from "express";
import { ProposalRepository } from "../../repositories/proposal/proposalRepository";
import { ProposalService } from "../../services/proposal/proposalService";
import { ActiveJobRepository } from "../../repositories/common/activeJobRepository";
import { ProposalController } from "../../controllers/proposal/proposalController";
import designerAuthentication from "../../middlewares/designerAuth";
import authenticate from "../../middlewares/auth";
import { JobRequestRepository } from "../../repositories/customer/jobRequestRepository";
import customerAuthentication from "../../middlewares/customerAuth";
import { ProposalVersionService } from "../../services/proposal/proposalVersionService";
import multer from "multer";
import { UserRepository } from "../../repositories/auth/userRepository";
import { ServiceVersionRepository } from "../../repositories/proposal/ServiceVersionRepository";
import { CloudinaryService } from "../../services/common/cloudinaryService";
import { TranscationRepository } from "../../repositories/common/transactionRepository";
import { FloorPlansService } from "../../services/proposal/floorPlansService";
import { FloorPlansRepository } from "../../repositories/proposal/floorPlansRepository";
import { reviewController } from "./reviewRoutes";
import { notificationService } from "../designer/jobApplicationRoutes";
import { DesignRepository } from "../../repositories/designer/designRepository";
const upload = multer({ storage: multer.memoryStorage() });

const router = Router()

const proposalRepo = new ProposalRepository()
const activeJobRepo = new ActiveJobRepository()
const jobRepo = new JobRequestRepository()
const userRepo = new UserRepository()
const floorPlanRepo = new FloorPlansRepository()
const imageUploaderService = new CloudinaryService()
const serviceVersionRepo = new ServiceVersionRepository()
const transactionRepo = new TranscationRepository()
const designRepo = new DesignRepository()
const proposalService = new ProposalService(notificationService, floorPlanRepo, proposalRepo, activeJobRepo, jobRepo, serviceVersionRepo)
const proposalVersionService = new ProposalVersionService(jobRepo, designRepo, activeJobRepo, transactionRepo, proposalRepo, serviceVersionRepo, imageUploaderService, userRepo)
const floorPlanService = new FloorPlansService(floorPlanRepo, imageUploaderService, proposalRepo)
const proposalController = new ProposalController(proposalService, proposalVersionService, floorPlanService)


router.post("/create", designerAuthentication, proposalController.createProposal)
router.patch("/update", designerAuthentication, proposalController.updateProposal)
router.patch("/approve-reject", customerAuthentication, proposalController.updateProposalStatus)
router.post("/upload-result", designerAuthentication, upload.fields([{ name: "serviceResult", maxCount: 20 }]), proposalController.uploadServiceResult)
router.post("/upload-floor-plan", designerAuthentication, upload.fields([{ name: "floorPlans", maxCount: 1 }]), proposalController.uploadFloorPlan)
router.patch("/approve-reject-version", customerAuthentication, proposalController.approveOrRejectVersion)
router.patch("/accept-reject-floor-plan", customerAuthentication, proposalController.acceptOrRejectFloorPlan)
router.get("/prefill/:id", designerAuthentication, proposalController.getProposalTemplate)
router.get("/:id", authenticate, proposalController.getProposal)
router.get("/review/:id", authenticate, reviewController.getReviewPerJob)
export default router