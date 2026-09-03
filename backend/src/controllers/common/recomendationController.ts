import { RespsonseHelper } from "../../shared/helpers/responseHelper";
import type { Request, Response } from "express";
import type { ICustomerInteractionService, IJobRequestService } from "../../interfaces/customer/ICustomerService";
import asyncHandler from "express-async-handler";
import type { IDesignerInteractionService, IDesignService } from "../../interfaces/designer/IDesignerService";


/**
 * this controller handle recomendation workflows
 */
export class RecomendationController {
    constructor(private _jobRequestService: IJobRequestService, private _designerRecomendation: IDesignerInteractionService, private _customerRecomendation: ICustomerInteractionService, private _designService: IDesignService) { }

    /**
     * to get recomended designs for the customers
     * @route GET /recomended/designs
     */
    recomendDesigns = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.userId;
        const result = userId ? await this._customerRecomendation.getRecomendedDesigns(userId) : await this._designService.getRecentDesigns()
        RespsonseHelper.successWithRecomendation(res, result)
    })

    /**
     * to get recomended jobs for designers
     * @route GET /recomended/jobs
     */
    recomendJobs = asyncHandler(async (req: Request, res: Response) => {
        const designerId = req.user?.userId;
        const result = designerId ? await this._designerRecomendation.getRecomendedJobs(designerId) : await this._jobRequestService.getRecentJobs()
        RespsonseHelper.successWithRecomendation(res, result)
    })
}