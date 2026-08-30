import { Router } from "express";
import { DisputeManagementController } from "../../controllers/admin/disputeManagementController";
import { DisputeManagementService } from "../../services/admin/disputeManagementService";
import { DisputeRepository } from "../../repositories/proposal/disputeRepository";
import { ProposalRepository } from "../../repositories/proposal/proposalRepository";
import adminAuthentication from "../../middlewares/adminAuth";


const router = Router()

const disputeRepo = new DisputeRepository()
const proposalRepo = new ProposalRepository()
const adminDisputeService = new DisputeManagementService( disputeRepo, proposalRepo)
const disputeManagementController = new DisputeManagementController(adminDisputeService)

router.post("/give-verdit", adminAuthentication, disputeManagementController.giveVerdit)
router.get("/", adminAuthentication, disputeManagementController.getAllDispute)
router.get("/:id", adminAuthentication, disputeManagementController.getDisputeDetail)

export default router