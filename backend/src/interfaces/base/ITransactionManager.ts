import { type ClientSession } from "mongoose";

export interface ITransactionManager {
  runInTransaction<T>(work: (session: ClientSession) => Promise<T>): Promise<T>;

}
