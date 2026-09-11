import { Router } from "express";
import multer from "multer";
import { CloudinaryService } from "../../services/common/cloudinaryService";
import authenticate from "../../middlewares/auth";
import { DisputeRepository } from "../../repositories/proposal/disputeRepository";
import { DisputeService } from "../../services/proposal/disputeService";
import { ProposalRepository } from "../../repositories/proposal/proposalRepository";
import { DisputeController } from "../../controllers/proposal/disputeController";
import { UserRepository } from "../../repositories/auth/userRepository";
import { TranscationRepository } from "../../repositories/common/transactionRepository";
import { ActiveJobRepository } from "../../repositories/common/activeJobRepository";
import { JobRequestRepository } from "../../repositories/customer/jobRequestRepository";
const upload = multer({ storage: multer.memoryStorage() });

const router = Router()

const disputeRepo = new DisputeRepository()
const proposalRepo = new ProposalRepository()
const userRepo = new UserRepository()
const activeJobRepo = new ActiveJobRepository()
const transactionRepo = new TranscationRepository()
const cloudinaryService = new CloudinaryService()
const jobRepo = new JobRequestRepository()
const disputeService = new DisputeService(jobRepo, activeJobRepo, transactionRepo, userRepo, proposalRepo, cloudinaryService, disputeRepo)
const disputeController = new DisputeController(disputeService)

router.get("/", authenticate, disputeController.getAllDispute)

router.post("/report-issue", authenticate, upload.fields([
    { name: "evidence", maxCount: 10 },
]), disputeController.reportIssue)


router.patch("/accept-reject", authenticate, disputeController.acceptOrRejectDispute)
router.get("/:id", authenticate, disputeController.getDispute)

export default router