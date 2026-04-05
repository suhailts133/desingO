import type { IApiResponse, IApiResponseWithPagination } from "../interfaces/base/IApiResponse.js";
import type { Response } from "express";


export class RespsonseHelper{
    static success<T>(res:Response,data:IApiResponse<T>){
        const {statuscode,...jsonData} = data;
        return res.status(statuscode).json(jsonData);
    }
    static successWithPagination<T>(res:Response,data:IApiResponseWithPagination<T>){
        const {statuscode,...jsonData} = data;
        return res.status(statuscode).json(jsonData);
    }
    
    static error(res:Response,message:string, error:string,statusCode:number){
        return res.status(statusCode).json({success:false, error,message})
    }

    // static successNew<T>(res:Response, data)
}