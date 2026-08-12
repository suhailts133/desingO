import mongoose, { type QueryFilter } from "mongoose";
import type { TransactionFilter, TransactionPopulated, TransactionRepoDTO } from "../../DTO/common/transaction";
import type { ITransaction, ITransactionRepository } from "../../interfaces/base/ITransaction";
import { TransactionModel } from "../../models/common/transactionModel";
import { BaseRepository } from "../baseRepository";
import type { Pagination } from "../../DTO/admin/adminDTO";
import type { IUser } from "../../interfaces/auth/IUser";

export class TranscationRepository extends BaseRepository<ITransaction> implements ITransactionRepository {
    constructor() {
        super(TransactionModel)
    }

    async createTransaction(data: TransactionRepoDTO): Promise<ITransaction> {
        return this.create({
            ...data,
            proposalId: new mongoose.Types.ObjectId(data.proposalId),
            sourceUserId: new mongoose.Types.ObjectId(data.sourceUserId),
            destinationUserId: new mongoose.Types.ObjectId(data.destinationUserId),
            disputeId: new mongoose.Types.ObjectId(data.disputeId),
        })
    }

    async getAllTransaction(filter?: TransactionFilter): Promise<{ data: TransactionPopulated[]; pagination: Pagination; }> {
        const page = filter?.page ? Number(filter.page) : 1;
        const limit = 6;
        const skip = (page - 1) * limit
        const query: QueryFilter<ITransaction> = {}
        if (filter) {
            if (filter.type) {
                query.type = filter.type
            }
        }

        const [result, total] = await Promise.all([
            this._model.find(query)
                .populate<{ destinationUserId: IUser }>("destinationUserId")
                .populate<{ sourceUserId: IUser }>("sourceUserId")
                .skip(skip)
                .limit(limit)
                .exec(),
            this._model.countDocuments(query)
        ])
        const pagination: Pagination = {
            total,
            totalPages: Math.ceil(total / limit)
        };

        return { data: result, pagination };
    }
}