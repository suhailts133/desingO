import type { IPaymentWebhookService } from "../../interfaces/proposal/IPaymentGateway.js";
import type { IPaymentService } from "../../interfaces/proposal/IProposalService.js";
import type { Request, Response } from "express"
import { RespsonseHelper } from "../../shared/helpers/responseHelper.js"
import { RESPONSE_CODE } from "../../shared/enums/statusCode.js"
import asyncHandler from "express-async-handler";
import { AppError } from "../../shared/errors/appError.js"
import { isObjectId } from "../../shared/helpers/extraFunctions.js";;
import { JOB_MESSAGES } from "../../shared/messages/jobMessages.js";
import Logger from "../../config/logger.js";
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


}