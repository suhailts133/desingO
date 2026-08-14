import type { IPaymentWebhookService } from "../../interfaces/proposal/IPaymentGateway";
import type { IPaymentService } from "../../interfaces/proposal/IProposalService";
import type { Request, Response } from "express"
import { RespsonseHelper } from "../../shared/helpers/responseHelper"
import { RESPONSE_CODE } from "../../shared/enums/statusCode"
import asyncHandler from "express-async-handler";
import { AppError } from "../../shared/errors/appError"
import { isObjectId } from "../../shared/helpers/extraFunctions";;
import { JOB_MESSAGES } from "../../shared/messages/jobMessages";
import Logger from "../../config/logger";
import { PROPOSAL_MESSAGES } from "../../shared/messages/proposalMessages";
/**
 * This controller has everything realted to payment
 */
export class PaymentController {
    constructor(private _paymentService: IPaymentService, private _paymentWebhookService: IPaymentWebhookService) { }

    /**
     * Handles incoming Stripe webhook events
     * @route POST /payments/webhook
     * @param req.body raw buffer of the request body (must not be parsed by express.json())
     * @param req.headers['stripe-signature'] signature header sent by Stripe to verify authenticity
     * @returns {{ received: true }} acknowledges receipt to Stripe
     * @throws {Error} if signature verification fails or event processing fails — causes Stripe to retry
     */
    handleWebhook = asyncHandler(async (req: Request, res: Response) => {
        const signature = req.headers['stripe-signature'] as string
        const result = await this._paymentWebhookService.handleWebhook(req.body, signature)
        res.status(RESPONSE_CODE.OK).json(result)
    })

    /**
   * for create new payment intent
   * @route POST /payments/intent
   * @param req.body.jobId jobid 
   * @throws {AppError} 400 if there is any issue with req.params.id or the id is not in the format of an objectid
  */
    createPaymentIntent = asyncHandler(async (req: Request, res: Response) => {
        Logger.info(`${JSON.stringify(req.body)}`)
        const { jobId } = req.body

        if (!jobId) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        if (!isObjectId(jobId as string)) {
            throw new AppError(JOB_MESSAGES.JOB_REQUEST.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }

        const result = await this._paymentService.createPaymentIntent(jobId)
        RespsonseHelper.success(res, result)
    })


    /**
      * to verify the payment
      * @route POST /payments/verify
      * @param req.body.intentId paymentIntentId
      * @throws {AppError} 400 if there is no intentid
     */
    getpaymentIntent = asyncHandler(async (req: Request, res: Response) => {
        const { intentId } = req.body
        if (!intentId) {
            throw new AppError(PROPOSAL_MESSAGES.PAYMENT.INTENT_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        const result = await this._paymentService.verifyPaymentIntent(intentId)
        RespsonseHelper.success(res, result)
    })


}