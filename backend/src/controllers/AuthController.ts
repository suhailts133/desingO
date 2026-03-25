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
import { ensureError } from "../helpers/ensureError.js";
import { RESPONSE_CODE } from "../helpers/enums/statusCode.js";


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

    refreshToken = async (req: Request, res: Response) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return RespsonseHelper.error(res, "Refresh token not found", "refresh token not found", RESPONSE_CODE.UNAUTHORIZED)
            }
            const reuslt = await this._authService.refreshToken(refreshToken)
            RespsonseHelper.success(res, reuslt)
        } catch (error) {
            const err = ensureError(error).message
            RespsonseHelper.error(res, "Error While hanlding refresh token", err, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }

    }

    register = async (req: Request, res: Response) => {
        const { error, value } = registerDataValidator.validate(req.body, { stripUnknown: true })
        if (error) {
            const err = error.details[0]?.message || "Missing fields or Invalid Data"
            RespsonseHelper.error(res, "Invalid data", err, RESPONSE_CODE.BAD_REQUEST)
        }
        const registerDTO: RegisterUserDTO = value
        try {
            const result = await this._authService.sendOTP(registerDTO);
            console.log(result)
            RespsonseHelper.success(res, result)
        } catch (error) {
            const err = ensureError(error).message
            RespsonseHelper.error(res, "Error While Registering", err, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
    }


    verifyOTP = async (req: Request, res: Response) => {
        try {
            const { error, value } = otpValidator.validate(req.body)
            if (error) {
                const err = error.details[0]?.message || "Missing fields or Invalid Data"
                RespsonseHelper.error(res, "Invalid data", err, RESPONSE_CODE.BAD_REQUEST)
            }

            const { email, otp } = value;
            const result = await this._authService.verifyOTP(email, otp)
            RespsonseHelper.success(res, result)
        } catch (error) {
            const err = ensureError(error).message
            RespsonseHelper.error(res, "Error While verifying otp", err, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }

    }


    resendOTP = async (req: Request, res: Response) => {
        try {
            const { error, value } = emailValidator.validate(req.body);
            if (error) {
                const err = error.details[0]?.message || "Missing fields or Invalid Data"
                RespsonseHelper.error(res, "Invalid data", err, RESPONSE_CODE.BAD_REQUEST)
            }
            const { email } = value
            const result = await this._authService.resendOTP(email);
            RespsonseHelper.success(res, result)
        } catch (error) {
            const err = ensureError(error).message
            RespsonseHelper.error(res, "Error While Registering", err, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
    }


    forgetPassword = async (req: Request, res: Response) => {
        try {
            const { error, value } = emailValidator.validate(req.body);
            if (error) {
                const err = error.details[0]?.message || "Missing fields or Invalid Data"
                RespsonseHelper.error(res, "Invalid data", err, RESPONSE_CODE.BAD_REQUEST)
            }
            const { email } = value
            const result = await this._authService.forgetPasswordOTPSent(email);
            RespsonseHelper.success(res, result)
        } catch (error) {
            const err = ensureError(error).message
            RespsonseHelper.error(res, "Error While Registering", err, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
    }


    forgetPasswordOTPVerification = async (req: Request, res: Response) => {
        try {
            const { error, value } = otpValidator.validate(req.body)
            if (error) {
                const err = error.details[0]?.message || "Missing fields or Invalid Data"
                RespsonseHelper.error(res, "Invalid data", err, RESPONSE_CODE.BAD_REQUEST)
            }

            const { email, otp } = value;
            const result = await this._authService.forgetPasswordOTPVerification(email, otp);
            RespsonseHelper.success(res, result)
        } catch (error) {
            const err = ensureError(error).message
            RespsonseHelper.error(res, "Error While Registering", err, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
    }


    forgetPasswordResentOTP = async (req: Request, res: Response) => {
        try {
            const { error, value } = emailValidator.validate(req.body);
            if (error) {
                const err = error.details[0]?.message || "Missing fields or Invalid Data"
                RespsonseHelper.error(res, "Invalid data", err, RESPONSE_CODE.BAD_REQUEST)
            }
            const { email } = value
            const result = await this._authService.forgetPasswordResendOTP(email);
            RespsonseHelper.success(res, result)
        } catch (error) {
            const err = ensureError(error).message
            RespsonseHelper.error(res, "Error While Registering", err, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
    }


    forgetPasswordChangePassword = async (req: Request, res: Response) => {
        try {
            const { error, value } = emailAndPasswordValidator.validate(req.body)
            if (error) {
                const err = error.details[0]?.message || "Missing fields or Invalid Data"
                RespsonseHelper.error(res, "Invalid data", err, RESPONSE_CODE.BAD_REQUEST)
            }
            const { email, password } = value
            const result = await this._authService.forgetPasswordChangePassword(email, password);
            RespsonseHelper.success(res, result)
        } catch (error) {
            const err = ensureError(error).message
            RespsonseHelper.error(res, "Error While Registering", err, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
    }


    login = async (req: Request, res: Response) => {
        try {
            const { error, value } = emailAndPasswordValidator.validate(req.body)
            if (error) {
                const err = error.details[0]?.message || "Missing fields or Invalid Data"
                RespsonseHelper.error(res, "Invalid data", err, RESPONSE_CODE.BAD_REQUEST)
            }
            const { email, password } = value
            const result = await this._authService.login(email, password);
            RespsonseHelper.success(res, result)
        } catch (error) {
            const err = ensureError(error).message
            RespsonseHelper.error(res, "Error While Registering", err, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
    }


    adminLogin = async (req: Request, res: Response) => {
        try {
            const { error, value } = emailAndPasswordValidator.validate(req.body)
            if (error) {
                const err = error.details[0]?.message || "Missing fields or Invalid Data"
                RespsonseHelper.error(res, "Invalid data", err, RESPONSE_CODE.BAD_REQUEST)
            }
            const { email, password } = value
            const result = await this._authService.adminLogin(email, password);
            RespsonseHelper.success(res, result)
        } catch (error) {
            const err = ensureError(error).message
            RespsonseHelper.error(res, "Error While Registering", err, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
    }


    googleLogin = async (req: Request, res: Response) => {
        try {
            if (!req.body.code) {
                RespsonseHelper.error(res, "Invalid data", "token not found", RESPONSE_CODE.BAD_REQUEST)
            }
            const result = await this._authService.googleLogin(req.body.code)
            RespsonseHelper.success(res, result)
        } catch (error) {
            const err = ensureError(error).message
            RespsonseHelper.error(res, "Error while google Login", err, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
    }
}

