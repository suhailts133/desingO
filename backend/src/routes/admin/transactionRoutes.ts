import { Router } from "express";
import adminAuthentication from "../../middlewares/adminAuth";
import { TransactionController } from "../../controllers/common/transactionController";
import { TransactionService } from "../../services/common/transcationService";
import { TranscationRepository } from "../../repositories/common/transactionRepository";


const router = Router()
const transactionRepo = new TranscationRepository()
const transactionService = new TransactionService(transactionRepo)
const transactionController = new TransactionController(transactionService)


router.get("/", adminAuthentication, transactionController.getAllTransaction)
router.get("/report", adminAuthentication, transactionController.getReport)

export default router