import type { Request, Response, NextFunction } from "express"
import { RESPONSE_CODE } from "../helpers/enums/statusCode.js"
import { AppError } from "../helpers/errors/appError.js"

export const globalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    let statusCode = RESPONSE_CODE.INTERNAL_SERVER_ERROR
    let message = "Something went wrong on our end."
    if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
    }
    res.status(statusCode).json({
        success: false,
        message: err.message
    })
}