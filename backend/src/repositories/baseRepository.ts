import { type ClientSession, type HydratedDocument, Model, type QueryFilter, type QueryOptions, type UpdateQuery } from "mongoose";
import type { IBaseRepository } from "../interfaces/base/IBaseRepository";


export abstract class BaseRepository<T> implements IBaseRepository<T> {
    constructor(protected readonly _model: Model<T>) { };


   async create(item: Partial<T>, session?: ClientSession): Promise<HydratedDocument<T>> {
        const doc = new this._model(item);
        await doc.save({ session: session ?? null });
        return doc;
    }


    async update(id: string, item: UpdateQuery<T>, session?: ClientSession): Promise<HydratedDocument<T> | null> {
        return await this._model.findByIdAndUpdate(id, item,
            {
                returnDocument: "after",
                session: session ?? null
            }).exec();
    }


    async delete(id: string, session?: ClientSession): Promise<boolean> {
        const result = await this._model.findByIdAndDelete(id, { session: session ?? null }).exec()
        return !!result
    }


    async find(filter: QueryFilter<T>, options?: QueryOptions, session?: ClientSession): Promise<HydratedDocument<T>[]> {
        return await this._model.find(filter, null, { ...options, session: session ?? null }).exec();
    }


    async findOne(filter: QueryFilter<T>, session?: ClientSession): Promise<HydratedDocument<T> | null> {
        return await this._model.findOne(filter, null, { session: session ?? null }).exec()
    }


    async findById(id: string, session?: ClientSession): Promise<HydratedDocument<T> | null> {
        return await this._model.findById(id, null, { session: session ?? null }).exec();
    }

    async updateOne(filter: QueryFilter<T>, item: UpdateQuery<T>, session?: ClientSession): Promise<HydratedDocument<T> | null> {
        return await this._model.findOneAndUpdate(filter, item, { returnDocument: "after", session: session ?? null }).exec();
    }
}