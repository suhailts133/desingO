import type { ITransactionService, TransactionType } from "../../interfaces/base/ITransaction";
import asyncHandler from "express-async-handler";
import type { Request, Response } from 'express'
import { DEFAULT_RANGE_DAYS, type ReportFilters, type ReportGroupBy, type TransactionFilter } from "../../DTO/common/transaction";
import { RespsonseHelper } from "../../shared/helpers/responseHelper";
import { transactionReportQueryValidation } from "../../validators/admin/transactionReportFilterValidation";
import { AppError } from "../../shared/errors/appError";
import { ADMIN_MESSAGES } from "../../shared/messages/adminMessages";
import { RESPONSE_CODE } from "../../shared/enums/statusCode";
import { TRANSACTION_REPORT_GROUP_TYPE } from "../../shared/enums/filterEnums";
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


    getReport = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = transactionReportQueryValidation.validate(req.query, { stripUnknown: true })
        if (error) {

            throw new AppError(error.details[0]?.message || "Invalid query parameters", RESPONSE_CODE.BAD_REQUEST)
        }
        const { groupBy, from, to, type } = value
        let finalFrom: string
        let finalTo: string
        if (groupBy === TRANSACTION_REPORT_GROUP_TYPE.CUSTOM) {
            if (!from || !to) {
                throw new AppError(ADMIN_MESSAGES.TRANSACTION.DATE_NOT_FOUND, RESPONSE_CODE.BAD_REQUEST)
            }
            if (new Date(from) > new Date(to)) {
                throw new AppError(ADMIN_MESSAGES.TRANSACTION.DATE_MISMATCH, RESPONSE_CODE.BAD_REQUEST);
            }
            finalFrom = from
            finalTo = to
        } else {
            const startDate = new Date()
            const endDate = new Date()
            const days = DEFAULT_RANGE_DAYS[groupBy as Exclude<ReportGroupBy, "custom">]
            startDate.setDate(startDate.getDate() - days)
            finalFrom = startDate.toISOString()
            finalTo = endDate.toISOString()
        }
        const filters: ReportFilters = {
            groupBy: groupBy as ReportGroupBy,
            from: finalFrom,
            to: finalTo,
            type: type as TransactionType
        };

        const result = await this._transactionService.generateReport(filters)
        RespsonseHelper.success(res, result)
    })


}