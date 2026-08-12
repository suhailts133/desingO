
import type { AllTransactionDTO, TransactionPopulated } from "../../DTO/common/transaction";

export class TransactionMapper {
    static toTransactionDTOList(data: TransactionPopulated[]): AllTransactionDTO[] {
        return data.map(d => ({
            id: d.id,
            amount: d.amount,
            type: d.type
        }))
    }


}