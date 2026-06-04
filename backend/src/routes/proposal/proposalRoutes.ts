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
const router = Router()

const proposalRepo = new ProposalRepository()
const activeJobRepo = new ActiveJobRepository()
const jobRepo= new JobRequestRepository()
const directHireRepo = new HireDesignerRepository()
const proposalService = new ProposalService(proposalRepo, activeJobRepo,jobRepo, directHireRepo)
const proposalController = new ProposalController(proposalService)


router.post("/create", designerAuthentication, proposalController.createProposal)
router.get("/:id", authenticate, proposalController.getProposal)
router.get("/prefill/:id/:slug", designerAuthentication, proposalController.getProposalTemplate)
router.patch("/approve-reject", customerAuthentication, proposalController.updateProposalStatus)

export default router