import type { IUser } from "../../interfaces/auth/IUser";
import type { ITransaction, TransactionType } from "../../interfaces/base/ITransaction";

export interface TransactionRepoDTO {
    amount: number;
    type: TransactionType;
    sourceUserId: string;
    destinationUserId?: string;
    proposalId?: string;
    disputeId?: string;
    paymentReference?: string;
}

export interface TransactionFilter{
      type?: TransactionType;
      page?:string
}
export interface AllTransactionDTO {
    id: string;
    amount: number;
    type: TransactionType;
}

export type TransactionPopulated = Omit<ITransaction, "sourceUserId" | "destinationUserId"> & {
    sourceUserId: IUser;
    destinationUserId: IUser;
};


