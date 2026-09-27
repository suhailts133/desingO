import { Router } from "express";
import { transactionController } from "../admin/transactionRoutes";
import authenticate from "../../middlewares/auth";

const router = Router();

router.get("/transaction-history", authenticate, transactionController.getTransactionHistory);

export default router;
