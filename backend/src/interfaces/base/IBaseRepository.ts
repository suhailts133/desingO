import type {UpdateQuery, QueryFilter, QueryOptions, HydratedDocument} from "mongoose";

export interface IBaseRepository<T >{
    create(item: Partial<T>):Promise<T>;
    update(id:string, item:UpdateQuery<T>):Promise<HydratedDocument<T> | null>;
    delete(id:string):Promise<boolean>
    find(filter: QueryFilter<T>, options?: QueryOptions): Promise<HydratedDocument<T>[]>;
    findOne(filter:QueryFilter<T>):Promise<T | null>;
    findById(id:string):Promise<HydratedDocument<T> | null>;
}