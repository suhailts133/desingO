import type { Request, Response } from "express"
import { RespsonseHelper } from "../../shared/helpers/responseHelper"
import asyncHandler from "express-async-handler";
import type { IDesignBenchMarkService } from "../../interfaces/benchmark/IBenchMarkService";
export class DesignBenchMarkController {
    constructor(private _designService:IDesignBenchMarkService) { }

    computeNewAveragePricBySPaceType = asyncHandler(async (req:Request, res:Response) => {
        const result = await this._designService.getNewBenchMark()
        RespsonseHelper.success(res,result)
    })
}