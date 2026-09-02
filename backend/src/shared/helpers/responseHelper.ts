import type { IApiResponse, IApiResponseWithPagination, IApiResponseWithRecomendation } from "../../interfaces/base/IApiResponse.js";
import type { Response } from "express";
import { RESPONSE_CODE } from "../enums/statusCode.js";


export class RespsonseHelper {
    static success<T>(res: Response, data: Partial<IApiResponse<T>>) {
        const { statuscode = RESPONSE_CODE.OK, success = true, ...jsonData } = data;
        return res.status(statuscode).json({ success, ...jsonData });
    }
    static successWithPagination<T>(res: Response, data: IApiResponseWithPagination<T>) {
        const { statuscode = RESPONSE_CODE.OK, success = true, ...jsonData } = data;
        return res.status(statuscode).json({ success, ...jsonData });
    }
    static successWithRecomendation<T>(res: Response, data: IApiResponseWithRecomendation<T>) {
        const { statuscode = RESPONSE_CODE.OK, success = true, ...jsonData } = data;
        return res.status(statuscode).json({ success, ...jsonData });
    }

    static error(res: Response, message: string, error: string, statusCode: number) {
        return res.status(statusCode).json({ success: false, error, message })
    }

    // static successNew<T>(res:Response, data)
}