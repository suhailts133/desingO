import { Router } from "express";
import express from "express"
import Stripe from "stripe";
import { StripePaymentGateway } from "../../services/stripe/StripePaymentGateway.js";
import { ProposalRepository } from "../../repositories/proposal/proposalRepository.js";
import { PaymentRepository } from "../../repositories/proposal/paymentRepository.js";
import { PaymentService } from "../../services/proposal/paymentService.js";
import { PaymentWebhookService } from "../../services/stripe/paymentWebhookService.js";
import { PaymentController } from "../../controllers/proposal/paymentController.js";
import authenticate from "../../middlewares/auth.js";

const router = Router()


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
const gateway = new StripePaymentGateway(stripe)
const proposalRepo = new ProposalRepository()
const paymentRepo = new PaymentRepository()
const paymentService = new PaymentService(gateway, proposalRepo, paymentRepo)
const webhookService = new PaymentWebhookService(stripe, paymentService)
const controller = new PaymentController(paymentService, webhookService)

router.post('/webhook', express.raw({ type: 'application/json' }), controller.handleWebhook)
router.use(express.json())
router.post("/intent", authenticate, controller.createPaymentIntent)


export default router