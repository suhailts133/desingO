// Types
import type { Request, Response } from "express";
import type { RegisterUserDTO } from "../../DTO/auth/authDTO";
import type { IAuthService } from "../../interfaces/auth/IAuthService";
// Validators
import { registerDataValidator, otpValidator, emailValidator, emailAndPasswordValidator } from "../../validators/auth/authDataValidators";

// Helpers
import { RespsonseHelper } from "../../shared/helpers/responseHelper";
import { RESPONSE_CODE } from "../../shared/enums/statusCode";

import asyncHandler from "express-async-handler";
import { AppError } from "../../shared/errors/appError";
import { AUTH_MESSAGES } from "../../shared/messages/authMessages";


/**
 * Handle all authentication based routes
 */
export class AuthController {
    constructor(private _authService: IAuthService) { }


    /**
     * for getting refresh token if the token is expired
     * @route GET auth/refresh
     * @param req.body.refreshToken
     * @throws {AppError} 401 if there is no refresh token
     */
    refreshToken = asyncHandler(async (req: Request, res: Response) => {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            throw new AppError(AUTH_MESSAGES.AUTH.EXPIRED, RESPONSE_CODE.UNAUTHORIZED)
        }
        const reuslt = await this._authService.refreshToken(refreshToken)
        RespsonseHelper.success(res, reuslt)
    })


    /**
     * For regestring new User
     * @route POST auth/signup
     * @param req.body {@link RegisterUserDTO}
     * @throws {AppError} 400 if there is any issue withr req.body
     */
    register = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = registerDataValidator.validate(req.body, { stripUnknown: true })
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }
        const registerDTO: RegisterUserDTO = value

        const result = await this._authService.sendOTP(registerDTO);
        RespsonseHelper.success(res, result)
    })


    /**
     * Verify otp for signup
     * @route POST auth/verify-otp
     * @param req.body.email - user's email
     * @param req.body.otp - the otp 
     * @throws {AppError} 400 if there is any issue with req.body
     */
    verifyOTP = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = otpValidator.validate(req.body)
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }

        const { email, otp } = value;
        const result = await this._authService.verifyOTP(email, otp)
        RespsonseHelper.success(res, result)
    })


    /**
     * resend otp for signup
     * @route POST auth/resend-otp
     * @param req.body.email - user's email
     * @throws {AppError} 400 if there is any issue with req.body
    */
    resendOTP = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = emailValidator.validate(req.body);
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }
        const { email } = value
        const result = await this._authService.resendOTP(email);
        RespsonseHelper.success(res, result)
    })


    /**
     * email verification for forget password
     * @route POST auth/forgetPassword
     * @param req.body.email - user's email
     * @throws {AppError} 400 if there is any issue with req.body
    */
    forgetPassword = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = emailValidator.validate(req.body);
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }
        const { email } = value
        const result = await this._authService.forgetPasswordOTPSent(email);
        RespsonseHelper.success(res, result)
    })


    /**
     * otp verification for forget password
     * @route POST auth/forgetPassword-verify-otp
     * @param req.body.email - user's email
     * @param req.body.otp - otp user have entered
     * @throws {AppError} 400 if there is any issue with req.body
    */
    forgetPasswordOTPVerification = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = otpValidator.validate(req.body)
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }
        const { email, otp } = value;
        const result = await this._authService.forgetPasswordOTPVerification(email, otp);
        RespsonseHelper.success(res, result)
    })


    /**
     * resend otp  for forget password
     * @route POST auth/forgetPassword-resend-otp
     * @param req.body.email - user's email
     * @throws {AppError} 400 if there is any issue with req.body
    */
    forgetPasswordResentOTP = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = emailValidator.validate(req.body);
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }
        const { email } = value
        const result = await this._authService.forgetPasswordResendOTP(email);
        RespsonseHelper.success(res, result)
    })


    /**
     * change password if user forget's it
     * @route POST auth/forgetPassword-change-password
     * @param req.body.email - user's email
     * @param req.body.password - new password
     * @throws {AppError} 400 if there is any issue with req.body
    */
    forgetPasswordChangePassword = asyncHandler(async (req: Request, res: Response) => {
        // const jti = req.user?.jti
        // const exp = req.user?.exp

        if(!req.user){
            throw new AppError(AUTH_MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }
        const { error, value } = emailAndPasswordValidator.validate(req.body)
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }
        const { email, password } = value
        const result = await this._authService.forgetPasswordChangePassword(email, password, req.user.jti, req.user.exp);
        RespsonseHelper.success(res, result)
    })

    
    /**
     *for login
     * @route POST auth/login
     * @param req.body.email - user's email
     * @param req.body.password - new password
     * @throws {AppError} 400 if there is any issue with req.body
    */
    login = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = emailAndPasswordValidator.validate(req.body)
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }
        const { email, password } = value
        const result = await this._authService.login(email, password);
        RespsonseHelper.success(res, result)
    })


    /**
     * for logging in as admin
     * @route POST auth/admin-login
     * @param req.body.email - user's email
     * @param req.body.password - new password
     * @throws {AppError} 400 if there is any issue with req.body
    */
    adminLogin = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = emailAndPasswordValidator.validate(req.body)
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }
        const { email, password } = value
        const result = await this._authService.adminLogin(email, password);
        RespsonseHelper.success(res, result)
    })


    /**
     * for login using google
     * @route POST auth/google
     * @param req.body.code - the token user recived from google
     * @throws {AppError} 400 if there is any issue with req.body
    */
    googleLogin = asyncHandler(async (req: Request, res: Response) => {
        if (!req.body.code) {
            throw new AppError(AUTH_MESSAGES.AUTH.TOKEN_NOT_FOUND, RESPONSE_CODE.BAD_REQUEST)
        }
        const result = await this._authService.googleLogin(req.body.code)
        RespsonseHelper.success(res, result)
    })

}

