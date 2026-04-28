// Types
import type { Request, Response } from "express";
import type { IAuthService } from "../interfaces/auth/IAuthService.js";
import type { RegisterUserDTO } from "../DTO/auth/authDTO.js";

// Validators
import {
    registerDataValidator,
    otpValidator,
    emailValidator,
    emailAndPasswordValidator
} from "../validators/auth/authDataValidators.js";

// Helpers
import { RespsonseHelper } from "../helpers/responseHelper.js";
import { RESPONSE_CODE } from "../helpers/enums/statusCode.js";

import asyncHandler from "express-async-handler";
import { AppError } from "../helpers/errors/appError.js";
import { MESSAGES } from "../helpers/enums/messages.js";

/**
 * AuthController handles all authentication-related endpoints.
 * all methods follow same pattern:
 * 1. Validate request data using Joi validators.
 * 2. Call the corresponding service method.
 * 3. Return standardized success or error response using ResponseHelper.
 * Errors in async operations are captured and normalized with ensureError.
 */
export class AuthController {
    constructor(private _authService: IAuthService) { }


    refreshToken = asyncHandler(async (req: Request, res: Response) => {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            throw new AppError(MESSAGES.AUTH.EXPIRED, RESPONSE_CODE.UNAUTHORIZED)
        }
        const reuslt = await this._authService.refreshToken(refreshToken)
        RespsonseHelper.success(res, reuslt)
    })

    register = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = registerDataValidator.validate(req.body, { stripUnknown: true })
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }
        const registerDTO: RegisterUserDTO = value

        const result = await this._authService.sendOTP(registerDTO);
        RespsonseHelper.success(res, result)
    })

    verifyOTP = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = otpValidator.validate(req.body)
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }

        const { email, otp } = value;
        const result = await this._authService.verifyOTP(email, otp)
        RespsonseHelper.success(res, result)
    })

    resendOTP = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = emailValidator.validate(req.body);
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }
        const { email } = value
        const result = await this._authService.resendOTP(email);
        RespsonseHelper.success(res, result)
    })

    forgetPassword = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = emailValidator.validate(req.body);
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }
        const { email } = value
        const result = await this._authService.forgetPasswordOTPSent(email);
        RespsonseHelper.success(res, result)
    })

    forgetPasswordOTPVerification = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = otpValidator.validate(req.body)
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }
        const { email, otp } = value;
        const result = await this._authService.forgetPasswordOTPVerification(email, otp);
        RespsonseHelper.success(res, result)
    })

    forgetPasswordResentOTP = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = emailValidator.validate(req.body);
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }
        const { email } = value
        const result = await this._authService.forgetPasswordResendOTP(email);
        RespsonseHelper.success(res, result)
    })

    forgetPasswordChangePassword = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = emailAndPasswordValidator.validate(req.body)
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }
        const { email, password } = value
        const result = await this._authService.forgetPasswordChangePassword(email, password);
        RespsonseHelper.success(res, result)
    })

    login = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = emailAndPasswordValidator.validate(req.body)
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }
        const { email, password } = value
        const result = await this._authService.login(email, password);
        RespsonseHelper.success(res, result)
    })

    adminLogin = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = emailAndPasswordValidator.validate(req.body)
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }
        const { email, password } = value
        const result = await this._authService.adminLogin(email, password);
        RespsonseHelper.success(res, result)
    })

    googleLogin = asyncHandler(async (req: Request, res: Response) => {
        if (!req.body.code) {
            throw new AppError(MESSAGES.AUTH.TOKEN_NOT_FOUND, RESPONSE_CODE.BAD_REQUEST)
        }
        const result = await this._authService.googleLogin(req.body.code)
        RespsonseHelper.success(res, result)
    })

}

