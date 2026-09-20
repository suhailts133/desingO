import mongoose, { type ClientSession } from "mongoose";
import type { ITransactionManager } from "../../interfaces/base/ITransactionManager";

export class MongooseTransactionManager implements ITransactionManager {
  async runInTransaction<T>(dbOp: (session: ClientSession) => Promise<T>): Promise<T> {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const result = await dbOp(session);
      await session.commitTransaction();
      console.log("transaction commited");
      return result;
    } catch (error) {
      await session.abortTransaction();
      console.log("Transaction aborted due to:", error);
      throw error;
    } finally {
      await session.endSession();
    }
  }

}
