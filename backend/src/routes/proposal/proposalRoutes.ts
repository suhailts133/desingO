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
const upload = multer({ storage: multer.memoryStorage() });

const router = Router()

const proposalRepo = new ProposalRepository()
const activeJobRepo = new ActiveJobRepository()
const jobRepo = new JobRequestRepository()
const userRepo = new UserRepository()
const imageUploaderService = new CloudinaryService()
const serviceVersionRepo = new ServiceVersionRepository()
const transactionRepo = new TranscationRepository()
const proposalService = new ProposalService(proposalRepo, activeJobRepo, jobRepo, serviceVersionRepo, imageUploaderService)
const proposalVersionService = new ProposalVersionService(activeJobRepo,transactionRepo, proposalRepo, serviceVersionRepo, imageUploaderService, userRepo)
const proposalController = new ProposalController(proposalService, proposalVersionService)


router.post("/create", designerAuthentication, proposalController.createProposal)
router.patch("/update", designerAuthentication, proposalController.updateProposal)
router.get("/:id", authenticate, proposalController.getProposal)
router.get("/prefill/:id", designerAuthentication, proposalController.getProposalTemplate)
router.patch("/approve-reject", customerAuthentication, proposalController.updateProposalStatus)
router.post("/upload-result", designerAuthentication, upload.fields([{ name: "serviceResult", maxCount: 20 }]), proposalController.uploadServiceResult)
router.patch("/upload-floor-plan", designerAuthentication, upload.fields([{ name: "floorPlans", maxCount: 10 }]), proposalController.uploadFloorPlan)
router.patch("/approve-reject-version", customerAuthentication, proposalController.approveOrRejectVersion)

export default router