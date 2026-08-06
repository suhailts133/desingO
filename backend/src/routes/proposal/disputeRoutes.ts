import { Router } from "express";
import multer from "multer";
import { CloudinaryService } from "../../services/common/cloudinaryService";
import authenticate from "../../middlewares/auth";
import { DisputeRepository } from "../../repositories/proposal/disputeRepository";
import { DisputeService } from "../../services/proposal/disputeService";
import { ProposalRepository } from "../../repositories/proposal/proposalRepository";
import { DisputeController } from "../../controllers/proposal/disputeController";
const upload = multer({ storage: multer.memoryStorage() });

const router = Router()

const disputeRepo = new DisputeRepository()
const proposalRepo = new ProposalRepository()
const cloudinaryService = new CloudinaryService()
const disputeService = new DisputeService(proposalRepo, cloudinaryService, disputeRepo)
const disputeController = new DisputeController(disputeService)

router.post("/report-issue", authenticate, upload.fields([
    { name: "evidence", maxCount: 10 },
]), disputeController.reportIssue)


router.patch("/accept-reject", authenticate, disputeController.acceptOrRejectDispute)
router.get("/:id", authenticate, disputeController.getDispute)

export default router