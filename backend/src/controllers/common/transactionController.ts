import type { ITransactionService } from "../../interfaces/base/ITransaction";
import asyncHandler from "express-async-handler";
import type { Request, Response } from 'express'
import type { TransactionFilter } from "../../DTO/common/transaction";
import { RespsonseHelper } from "../../shared/helpers/responseHelper";
/**
 * this controller handle all transaction related stuff in the admin side
 */
export class TransactionController {
    constructor(private _transactionService: ITransactionService) { }

    /**
     * to get all transactions
     * @param req.query {@link TransactionFilter}
     * @route GET /transaction/
     */
    getAllTransaction = asyncHandler(async (req: Request, res: Response) => {
        const result = await this._transactionService.getAllTransaction(req.query as TransactionFilter)
        RespsonseHelper.successWithPagination(res, result)
    })

}