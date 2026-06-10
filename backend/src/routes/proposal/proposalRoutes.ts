import { Router } from "express";
import { ProposalRepository } from "../../repositories/proposal/proposalRepository.js";
import { ProposalService } from "../../services/proposal/proposalService.js";
import { ActiveJobRepository } from "../../repositories/common/activeJobRepository.js";
import { ProposalController } from "../../controllers/proposal/proposalController.js";
import designerAuthentication from "../../middlewares/designerAuth.js";
import authenticate from "../../middlewares/auth.js";
import { JobRequestRepository } from "../../repositories/customer/jobRequestRepository.js";
import { HireDesignerRepository } from "../../repositories/customer/hireDesignerRepository.js";
import customerAuthentication from "../../middlewares/customerAuth.js";
import { ProposalVersionService } from "../../services/proposal/proposalVersionService.js";
import multer from "multer";
import { UserRepository } from "../../repositories/auth/userRepository.js";
import { ServiceVersionRepository } from "../../repositories/proposal/ServiceVersionRepository.js";
import { CloudinaryService } from "../../services/common/cloudinaryService.js";
const upload = multer({ storage: multer.memoryStorage() });

const router = Router()

const proposalRepo = new ProposalRepository()
const activeJobRepo = new ActiveJobRepository()
const jobRepo = new JobRequestRepository()
const directHireRepo = new HireDesignerRepository()
const userRepo = new UserRepository()
const imageUploaderService = new CloudinaryService()
const serviceVersionRepo = new ServiceVersionRepository()
const proposalService = new ProposalService(proposalRepo, activeJobRepo, jobRepo, directHireRepo, serviceVersionRepo)
const proposalVersionService = new ProposalVersionService(proposalRepo, serviceVersionRepo, imageUploaderService, userRepo)
const proposalController = new ProposalController(proposalService, proposalVersionService)


router.post("/create", designerAuthentication, proposalController.createProposal)
router.get("/:id", authenticate, proposalController.getProposal)
router.get("/prefill/:id/:slug", designerAuthentication, proposalController.getProposalTemplate)
router.patch("/approve-reject", customerAuthentication, proposalController.updateProposalStatus)
router.post("/upload-result", designerAuthentication, upload.fields([{ name: "serviceResult", maxCount: 20 }]), proposalController.uploadServiceResult)
router.patch("/approve-reject-version", customerAuthentication, proposalController.approveOrRejectVersion)

export default router