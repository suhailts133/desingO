import { Router } from "express";
import express from "express"
import Stripe from "stripe";
import { StripePaymentGateway } from "../../services/stripe/StripePaymentGateway";
import { ProposalRepository } from "../../repositories/proposal/proposalRepository";
import { PaymentRepository } from "../../repositories/proposal/paymentRepository";
import { PaymentService } from "../../services/proposal/paymentService";
import { PaymentWebhookService } from "../../services/stripe/paymentWebhookService";
import { PaymentController } from "../../controllers/proposal/paymentController";
import authenticate from "../../middlewares/auth";
import { TranscationRepository } from "../../repositories/common/transactionRepository";

const router = Router()


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
const gateway = new StripePaymentGateway(stripe)
const proposalRepo = new ProposalRepository()
const paymentRepo = new PaymentRepository()
const transactionRepo = new TranscationRepository()
const paymentService = new PaymentService(transactionRepo, gateway, proposalRepo, paymentRepo)
const webhookService = new PaymentWebhookService(stripe, paymentService)
const controller = new PaymentController(paymentService, webhookService)

router.post('/webhook', express.raw({ type: 'application/json' }), controller.handleWebhook)
router.use(express.json())
router.post("/intent", authenticate, controller.createPaymentIntent)
router.post("/verify", authenticate, controller.getpaymentIntent)


export default router