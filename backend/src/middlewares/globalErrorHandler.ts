import type { Request, Response, NextFunction } from "express"
import { RESPONSE_CODE } from "../shared/enums/statusCode.js"
import { AppError } from "../shared/errors/appError.js"

export const globalErrorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
    let statusCode = RESPONSE_CODE.INTERNAL_SERVER_ERROR
    let message = "Something went wrong on our end."
    console.log(err)
    if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message || message
    }
    res.status(statusCode).json({
        statusCode: statusCode,
        success: false,
        message: err.message || message,
        data: err instanceof AppError ? err.data : undefined
    })
}