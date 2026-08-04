import { Router } from "express";
import { ProposalRepository } from "../../repositories/proposal/proposalRepository";
import { ProposalService } from "../../services/proposal/proposalService";
import { ActiveJobRepository } from "../../repositories/common/activeJobRepository";
import { ProposalController } from "../../controllers/proposal/proposalController";
import designerAuthentication from "../../middlewares/designerAuth";
import authenticate from "../../middlewares/auth";
import { JobRequestRepository } from "../../repositories/customer/jobRequestRepository";
import { HireDesignerRepository } from "../../repositories/customer/hireDesignerRepository";
import customerAuthentication from "../../middlewares/customerAuth";
import { ProposalVersionService } from "../../services/proposal/proposalVersionService";
import multer from "multer";
import { UserRepository } from "../../repositories/auth/userRepository";
import { ServiceVersionRepository } from "../../repositories/proposal/ServiceVersionRepository";
import { CloudinaryService } from "../../services/common/cloudinaryService";
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