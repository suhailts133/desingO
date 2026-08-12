import type { TransactionFilter, AllTransactionDTO } from "../../DTO/common/transaction";
import { TransactionMapper } from "../../dtoMappers/common/TransactionMapper";
import type { IApiResponseWithPagination } from "../../interfaces/base/IApiResponse";
import type { ITransactionRepository, ITransactionService } from "../../interfaces/base/ITransaction";
import { ADMIN_MESSAGES } from "../../shared/messages/adminMessages";

export class TransactionService implements ITransactionService {
    constructor(private _transactionRepo: ITransactionRepository) { }

    async getAllTransaction(filter?: TransactionFilter): Promise<IApiResponseWithPagination<AllTransactionDTO[]>> {
        const { pagination, data } = await this._transactionRepo.getAllTransaction(filter)
        const transactionData = TransactionMapper.toTransactionDTOList(data)
        return { message: ADMIN_MESSAGES.TRANSACTION.FETCH_ALL, data: transactionData, total: pagination.total, totalPages: pagination.totalPages }
    }
}