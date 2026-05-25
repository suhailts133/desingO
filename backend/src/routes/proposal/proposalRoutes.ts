import { Router } from "express";
import { ProposalRepository } from "../../repositories/proposal/proposalRepository.js";
import { ProposalService } from "../../services/proposal/proposalService.js";
import { ActiveJobRepository } from "../../repositories/common/activeJobRepository.js";
import { ProposalController } from "../../controllers/proposal/proposalController.js";
const router = Router()

const proposalRepo = new ProposalRepository()
const activeJobRepo = new ActiveJobRepository()
const proposalService = new ProposalService(proposalRepo, activeJobRepo)
const proposalController = new ProposalController(proposalService)


router.post("/create", proposalController.createProposal)

export default router