import { Router } from "express";
import { DisputeManagementController } from "../../controllers/admin/disputeManagementController";
import { DisputeManagementService } from "../../services/admin/disputeManagementService";
import { DisputeRepository } from "../../repositories/proposal/disputeRepository";
import { ProposalRepository } from "../../repositories/proposal/proposalRepository";
import { UserRepository } from "../../repositories/auth/userRepository";
import adminAuthentication from "../../middlewares/adminAuth";
import { TranscationRepository } from "../../repositories/common/transactionRepository";



const router = Router()

const disputeRepo = new DisputeRepository()
const proposalRepo = new ProposalRepository()
const userRepo = new UserRepository()
const transactionRepo = new TranscationRepository()
const adminDisputeService = new DisputeManagementService(transactionRepo, disputeRepo, proposalRepo, userRepo)
const disputeManagementController = new DisputeManagementController(adminDisputeService)

router.post("/give-verdit", adminAuthentication, disputeManagementController.giveVerdit)
router.get("/", adminAuthentication, disputeManagementController.getAllDispute)
router.get("/:id", adminAuthentication, disputeManagementController.getDisputeDetail)

export default router