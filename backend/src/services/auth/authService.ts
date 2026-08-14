import generateOtp from "../../shared/jwt/generateOTP";
import sendVerificationEmail from "../../shared/emails/sendOTP";
import { comparePassword, hashPassword } from "../../shared/helpers/hashPassword";
import { jwtAccessToken } from "../../shared/jwt/jsonTokenCreater";
import { RESPONSE_CODE } from "../../shared/enums/statusCode";
import { jwtRefreshToken, refeshTokenVerificaion } from "../../shared/jwt/refreshToken";

import type { IOTPRepository } from "../../interfaces/auth/IOtpRepository";
import type { IAuthService } from "../../interfaces/auth/IAuthService";
import type { IUserRepository } from "../../interfaces/auth/IUserRepository";
import type { IUserTemp } from "../../interfaces/auth/IUser";
import type { IApiResponse } from "../../interfaces/base/IApiResponse";

import type { CreateUserDTO, RegisterUserDTO, AuthResponseDTO, RefreshTokenDTO } from "../../DTO/auth/authDTO";
import { googleLoginResponse } from "../common/googleAuth";
import { AppError } from "../../shared/errors/appError";
import { AUTH_MESSAGES } from "../../shared/messages/authMessages";
import { USER_ROLES } from "../../shared/enums/commonEnums";
import { UserMapper } from "../../dtoMappers/user/userMapper";

import { v4 as uuidv4 } from "uuid"
import type { IBlackListRepository, IRefreshTokenRepository, RefreshTokenPayload } from "../../interfaces/auth/IRefreshToken";


/**
 * Service managing user and admin authentication workflows.
 * 
 * Handles signup/login operations, OAuth integration (Google), email OTP generation, 
 * verification, password recovery, and JWT token issuance/refreshing.
 */
export class AuthService implements IAuthService {

    constructor(
        private _otpRepository: IOTPRepository,
        private _userRepository: IUserRepository,
        private _refreshTokenRepo: IRefreshTokenRepository,
        private _blackListRepo: IBlackListRepository
    ) { }


    /**
     * Issues a new access token using a valid, non-expired refresh token.
     * 
     * @param refreshToken - The refresh token provided by the client.
     * @returns Object containing the newly generated access token.
     * @throws {AppError} 401 - If the refresh token is missing, invalid, or expired.
     */
    async refreshToken(refreshToken: string): Promise<IApiResponse<RefreshTokenDTO>> {

        const verifiedRefreshToken = refeshTokenVerificaion(refreshToken)
        const storedToken = await this._refreshTokenRepo.getRefreshToken(refreshToken);
        if (!storedToken) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.EXPIRED_TOKEN, RESPONSE_CODE.UNAUTHORIZED)
        }
        if (!verifiedRefreshToken) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.EXPIRED_TOKEN, RESPONSE_CODE.UNAUTHORIZED)
        }
        const createNewAccessToken = jwtAccessToken(
            verifiedRefreshToken.email,
            verifiedRefreshToken.userId,
            verifiedRefreshToken.name,
            verifiedRefreshToken.role,
            uuidv4()
        )
        return { message: AUTH_MESSAGES.LOGIN_SIGNUP.NEW_TOKEN_CREATED, data: { newAccessToken: createNewAccessToken } }
    }


    /**
     * Send OTP to user's email for authenticating the email.
     * 
     * Hashes the user's password and temporarily persists pending account data in Redis.
     * 
     * @param data - User registration details including full name, email, and password.
     * @returns Success message confirming the OTP email was dispatched.
     * @throws {AppError} 409 - If an account with the specified email already exists.
     * @throws {AppError} 500 - If saving temporary user data to Redis fails.
     */
    async sendOTP(data: RegisterUserDTO): Promise<IApiResponse> {
        const existingUser = await this._userRepository.findEmail(data.email);
        if (existingUser) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.EMAIL_ALREADY_EXISTS, RESPONSE_CODE.CONFILT)
        }
        const otp = generateOtp();
        const hashedPassword = await hashPassword(data.password)
        const pendingUser: IUserTemp = {
            full_name: data.full_name,
            email: data.email,
            otp,
            password: hashedPassword
        }
        const isSaved = await this._otpRepository.saveUserData(pendingUser)
        if (!isSaved) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.OTP_SENT_FAIL, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        await sendVerificationEmail(data.email, otp)
        return { message: AUTH_MESSAGES.LOGIN_SIGNUP.OTP_SENT_SUCCESS }
    }


    /**
     * Verifies the otp and if completed create the user.
     * 
     * On successful verification, creates the user in the database, generates access 
     * and refresh tokens, stores the refresh token, and clears temporary OTP data.
     * 
     * @param email - Email address associated with the pending registration.
     * @param otp - The OTP string submitted by the user.
     * @returns Authentication payload containing user details and tokens (HTTP 201).
     * @throws {AppError} 404 - If pending registration data has expired or is not found.
     * @throws {AppError} 400 - If the provided OTP is incorrect.
     */
    async verifyOTP(email: string, otp: string): Promise<IApiResponse<AuthResponseDTO>> {
        const pendingUser = await this._otpRepository.getUserData(email);
        if (!pendingUser) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.OTP_EXPIRED, RESPONSE_CODE.NOT_FOUND)
        }
        const newUserData: CreateUserDTO = {
            full_name: pendingUser.full_name,
            email: pendingUser.email,
            password: pendingUser.password
        }
        if (pendingUser.otp === otp) {
            const newUser = await this._userRepository.createNewUser(newUserData)
            const accessToken = jwtAccessToken(newUser.email, newUser.id, newUser.full_name, newUser.role, uuidv4())
            const refreshToken = jwtRefreshToken(newUser.email, newUser.id, newUser.full_name, newUser.role)
            await this._refreshTokenRepo.storeToken({
                token: refreshToken,
                userId: newUser.id,
                expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
            })
            await this._otpRepository.deleteUserData(newUser.email)
            const userData = UserMapper.toAuthResponseDTO(newUser, accessToken, refreshToken)

            return { message: AUTH_MESSAGES.LOGIN_SIGNUP.OTP_SUCCESS, data: userData, statuscode: RESPONSE_CODE.CREATED }
        }
        throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.OTP_INCORRECT, RESPONSE_CODE.BAD_REQUEST)
    }



    /**
     * Resend OTP to email for account verification.
     * 
     * Updates the existing pending user record in Redis with a new OTP code.
     * 
     * @param email - Target email address for the pending registration.
     * @returns Success message confirming the new OTP was sent.
     * @throws {AppError} 409 - If the email is already associated with an active account.
     * @throws {AppError} 500 - If updating the OTP in Redis fails.
     */
    async resendOTP(email: string): Promise<IApiResponse> {
        const userExists = await this._userRepository.findEmail(email);
        if (userExists) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.EMAIL_ALREADY_EXISTS, RESPONSE_CODE.CONFILT)
        }
        const newOTP = generateOtp();
        const isSaved = await this._otpRepository.editUserData(newOTP, email);
        if (!isSaved) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.OTP_SENT_FAIL, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        await sendVerificationEmail(email, newOTP);
        return { message: AUTH_MESSAGES.LOGIN_SIGNUP.OTP_SENT_SUCCESS }
    }


    /**
     * Send OTP to user's account to verify the user.
     * 
     * Stores the generated OTP in Redis under the user's email key.
     * 
     * @param email - Registered account email address.
     * @returns Success message confirming OTP delivery.
     * @throws {AppError} 404 - If no user account is found with the provided email.
     * @throws {AppError} 500 - If storing the reset OTP in Redis fails.
     */
    async forgetPasswordOTPSent(email: string): Promise<IApiResponse> {
        const userExists = await this._userRepository.findEmail(email);
        if (!userExists) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.EMAIL_NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        const forgetPasswordOTP = generateOtp()

        const isSaved = await this._otpRepository.saveOTP(forgetPasswordOTP, email);
        if (!isSaved) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.OTP_SENT_FAIL, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        await sendVerificationEmail(email, forgetPasswordOTP)
        return { message: AUTH_MESSAGES.LOGIN_SIGNUP.OTP_SENT_SUCCESS }
    }



    /**
     * Verifies OTP for forget password which is been stored in the redis.
     * 
     * Deletes the OTP key upon successful matching to prevent reuse.
     * 
     * @param email - Registered account email address.
     * @param otp - The reset OTP submitted by the user.
     * @returns Success message confirming OTP verification.
     * @throws {AppError} 404 - If the email does not exist or the OTP has expired.
     * @throws {AppError} 400 - If the provided OTP does not match.
     */
    async forgetPasswordOTPVerification(email: string, otp: string): Promise<IApiResponse> {

        const findEmailCheck = await this._userRepository.findEmail(email);
        if (!findEmailCheck) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.EMAIL_NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        const savedOTP = await this._otpRepository.getOTP(email)
        if (savedOTP === null) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.OTP_EXPIRED, RESPONSE_CODE.NOT_FOUND)
        }

        const otpChecking = otp === savedOTP
        if (!otpChecking) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.OTP_INCORRECT, RESPONSE_CODE.BAD_REQUEST)
        }
        const deleted = await this._otpRepository.deleteOTP(email);
        if (deleted === 0) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.OTP_EXPIRED, RESPONSE_CODE.NOT_FOUND);
        }
        return { message: AUTH_MESSAGES.LOGIN_SIGNUP.OTP_SUCCESS }

    }



    /**
     * Resend OTP to the user's email for password reseting.
     * 
     * @param email - Registered account email address.
     * @returns Success message confirming the new OTP was dispatched.
     * @throws {AppError} 404 - If no account exists with the provided email.
     * @throws {AppError} 500 - If updating the OTP in Redis fails.
     */
    async forgetPasswordResendOTP(email: string): Promise<IApiResponse> {
        const userExists = await this._userRepository.findEmail(email);
        if (!userExists) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.EMAIL_NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        const newOTP = generateOtp();
        const isSaved = await this._otpRepository.editOTP(newOTP, email);
        if (!isSaved) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.OTP_SENT_FAIL, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        await sendVerificationEmail(email, newOTP)
        return { message: AUTH_MESSAGES.LOGIN_SIGNUP.OTP_SENT_SUCCESS }

    }


    /**
     * Updates a user's password following a verified reset request.
     * 
     * Hashes the new password, updates the user record, invalidates all active refresh tokens, 
     * and blacklists the active JWT token ID (JTI) for remaining lifetime.
     * 
     * @param email - Registered account email address.
     * @param password - The new unhashed password.
     * @param jti - Unique identifier (JTI) of the current access token to invalidate.
     * @param exp - Token expiration timestamp (in seconds).
     * @returns Success message confirming the password update.
     * @throws {AppError} 404 - If no account exists with the provided email.
     * @throws {AppError} 500 - If updating the password fails in the repository.
     */
    async forgetPasswordChangePassword(email: string, password: string, jti: string, exp: number): Promise<IApiResponse> {
        const userExists = await this._userRepository.findEmail(email);
        if (!userExists) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.EMAIL_NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        const hashedPassword = await hashPassword(password);
        const isPasswordChanged = await this._userRepository.changePassword(email, hashedPassword)
        if (!isPasswordChanged) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.PASSWORD_CHANGE_FAIL, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        const ttl = exp - Math.floor(Date.now() / 1000)

        if (ttl > 0) {
            await this._blackListRepo.storeToken(jti, ttl)
        }
        await this._refreshTokenRepo.deleteAllTokens(isPasswordChanged.id)
        return { message: AUTH_MESSAGES.LOGIN_SIGNUP.PASSWORD_CHANGE_SUCCESS }
    }



    /**
     * allow user login.
     * 
     * Validates account status, block state, and password match before issuing 
     * access and refresh tokens.
     * 
     * @param email - User's email address.
     * @param password - Plain-text password input.
     * @returns access and refesh token and user data like (email, role and id).
     * @throws {AppError} 404 - If the user account is not found.
     * @throws {AppError} 403 - If the user account is blocked.
     * @throws {AppError} 400 - If credentials are invalid or user signed up via Google.
     * @throws {AppError} 500 - If storing the refresh token fails.
     */
    async login(email: string, password: string): Promise<IApiResponse<AuthResponseDTO>> {
        const userExists = await this._userRepository.findUser(email);
        if (!userExists) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.INVALID_CREDENTIALS, RESPONSE_CODE.NOT_FOUND)
        }
        if (userExists.is_blocked) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.USER_BLOCKED, RESPONSE_CODE.FORBIDDEN)
        }
        if (!userExists.password) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.GOOGLE_LOGIN_DETECTED, RESPONSE_CODE.BAD_REQUEST)

        }
        const checkPassword = await comparePassword(password, userExists.password);
        if (!checkPassword) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.INVALID_CREDENTIALS, RESPONSE_CODE.BAD_REQUEST)

        }
        const accessToken = jwtAccessToken(userExists.email, userExists.id, userExists.full_name, userExists.role, uuidv4());
        const refreshToken = jwtRefreshToken(userExists.email, userExists.id, userExists.full_name, userExists.role)
        const storeTokenPayload: RefreshTokenPayload = {
            token: refreshToken,
            userId: userExists.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }

        const isStored = await this._refreshTokenRepo.storeToken(storeTokenPayload)
        if (!isStored) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.LOGIN_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        const authResponse = UserMapper.toAuthResponseDTO(userExists, accessToken, refreshToken)

        return { message: AUTH_MESSAGES.LOGIN_SIGNUP.LOGIN_SUCCESS, data: authResponse }

    }



    /**
     * Authenticates an admin with email and password.
     * 
     * Verifies that the user possesses the `ADMIN` role before granting system access.
     * 
     * @param email - Admin account email address.
     * @param password - password.
     * @returns access and refesh token and user data like (email, role and id).
     * @throws {AppError} 400 - If account is not found, password fails, or user lacks `ADMIN` role.
     * @throws {AppError} 500 - If storing the refresh token fails.
     */
    async adminLogin(email: string, password: string): Promise<IApiResponse<AuthResponseDTO>> {
        const adminExists = await this._userRepository.findUser(email);
        if (!adminExists) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.NOT_ADMIN, RESPONSE_CODE.BAD_REQUEST)

        }
        if (adminExists.role !== USER_ROLES.ADMIN) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.NOT_ADMIN, RESPONSE_CODE.BAD_REQUEST)
        }
        const checkPassword = await comparePassword(password, adminExists.password!);
        if (!checkPassword) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.NOT_ADMIN, RESPONSE_CODE.BAD_REQUEST)
        }
        const accessToken = jwtAccessToken(adminExists.email, adminExists.id, adminExists.full_name, adminExists.role, uuidv4());
        const refreshToken = jwtRefreshToken(adminExists.email, adminExists.id, adminExists.full_name, adminExists.role)
        const storeTokenPayload: RefreshTokenPayload = {
            token: refreshToken,
            userId: adminExists.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
        const isTokenStored = await this._refreshTokenRepo.storeToken(storeTokenPayload)
        if (!isTokenStored) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.LOGIN_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        const authResponse = UserMapper.toAuthResponseDTO(adminExists, accessToken, refreshToken)
        return { message: AUTH_MESSAGES.LOGIN_SIGNUP.LOGIN_SUCCESS, data: authResponse, }

    }


    /**
     * Authenticates or registers a user via Google OAuth2 authorization code.
     * 
     * - If user exists with matching Google Profile ID: access and refresh token.
     * - If user exists with matching email: links Google Profile ID and profile image, then issues tokens.
     * - If user does not exist: creates a new user account and issues tokens.
     * 
     * @param code - Authorization code obtained from Google OAuth client.
     * @returns access and refesh token and user data like (email, role and id).
     * @throws {AppError} 404 - If Google user profile exchange fails.
     * @throws {AppError} 500 - If storing the refresh token fails.
     */
    async googleLogin(code: string): Promise<IApiResponse<AuthResponseDTO>> {

        const googleData = await googleLoginResponse(code);

        if (!googleData) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.GOOGLE_DATA_ACCESS_FAIL, RESPONSE_CODE.NOT_FOUND)

        }
        const user = await this._userRepository.findUser(googleData.email);

        if (user) {
            if (user.google_profile_id === googleData.google_profile_id) {
                const access_token = jwtAccessToken(user.email, user.id, user.full_name, user.role, uuidv4())
                const refreshToken = jwtRefreshToken(user.email, user.id, user.full_name, user.role)
                const storeTokenPayload: RefreshTokenPayload = {
                    token: refreshToken,
                    userId: user.id,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                }
                const storeToken = await this._refreshTokenRepo.storeToken(storeTokenPayload)
                if (!storeToken) {
                    throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.LOGIN_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
                }
                const authResponse = UserMapper.toAuthResponseDTO(user, access_token, refreshToken)
                return { message: AUTH_MESSAGES.LOGIN_SIGNUP.LOGIN_SUCCESS, data: authResponse, }
            }


            const data = await this._userRepository.updateUser(user.id, {
                google_profile_id: googleData.google_profile_id,
                profile_image_url: googleData.profile_image_url,
                full_name: googleData.full_name
            })
            if (data) {
                const access_token = jwtAccessToken(data.email, data.id, data.full_name, data.role, uuidv4())
                const refreshToken = jwtRefreshToken(data.email, data.id, data.full_name, data.role)
                const storeTokenPayload: RefreshTokenPayload = {
                    token: refreshToken,
                    userId: data.id,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                }

                const storeToken = await this._refreshTokenRepo.storeToken(storeTokenPayload)
                if (!storeToken) {
                    throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.LOGIN_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
                }
                const authResponse = UserMapper.toAuthResponseDTO(data, access_token, refreshToken)
                return { message: AUTH_MESSAGES.LOGIN_SIGNUP.LOGIN_SUCCESS, data: authResponse, }
            }

        }
        const result = await this._userRepository.createNewUser(googleData);


        const access_token = jwtAccessToken(result.email, result.id, result.full_name, result.role, uuidv4())
        const refreshToken = jwtRefreshToken(result.email, result.id, result.full_name, result.role)
        const storeTokenPayload: RefreshTokenPayload = {
            token: refreshToken,
            userId: result.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }

        const storeToken = await this._refreshTokenRepo.storeToken(storeTokenPayload)
        if (!storeToken) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.LOGIN_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        const authResponse = UserMapper.toAuthResponseDTO(result, access_token, refreshToken)

        return { message: AUTH_MESSAGES.LOGIN_SIGNUP.LOGIN_SUCCESS, data: authResponse }

    }
}
