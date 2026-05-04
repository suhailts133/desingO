// Helpers
import generateOtp from "../../shared/jwt/generateOTP.js";
import sendVerificationEmail from "../../shared/emails/sendOTP.js";
import { comparePassword, hashPassword } from "../../shared/helpers/hashPassword.js";
import { jwtAccessToken } from "../../shared/jwt/jsonTokenCreater.js";
import { RESPONSE_CODE } from "../../shared/enums/statusCode.js";
import { jwtRefreshToken, refeshTokenVerificaion } from "../../shared/jwt/refreshToken.js";
// Interfaces / Repositories
import type { IOTPRepository } from "../../interfaces/auth/IOtpRepository.js";
import type { IAuthService } from "../../interfaces/auth/IAuthService.js";
import type { IUserRepository } from "../../interfaces/auth/IUserRepository.js";
import type { IUserTemp } from "../../interfaces/auth/IUser.js";
import type { IApiResponse } from "../../interfaces/base/IApiResponse.js";
// DTOs
import type { CreateUserDTO, RegisterUserDTO, AuthResponseDTO, RefreshTokenDTO } from "../../DTO/auth/authDTO.js";
import { googleLoginResponse } from "../common/googleAuth.js";
import { AppError } from "../../shared/errors/appError.js";
import { AUTH_MESSAGES } from "../../shared/messages/authMessages.js";
import { USER_ROLES } from "../../shared/enums/commonEnums.js";
import { UserMapper } from "../../dtoMappers/user/userMapper.js";



/**
* Auth Service handle all the authentication based operations.
* 1. sent OTPs from verifications - registering and reset password
* 2. signup and logging user and also admin login 
* 3. google signup
* 4. refresh token too
* also interacts with userRepo and OTPRepo(Redis)
*/

export class AuthService implements IAuthService {

    constructor(private _otpRepository: IOTPRepository, private _userRepository: IUserRepository) { }


    async refreshToken(refreshToken: string): Promise<IApiResponse<RefreshTokenDTO>> {

        const verifiedRefreshToken = refeshTokenVerificaion(refreshToken)
        if (!verifiedRefreshToken) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.EXPIRED_TOKEN, RESPONSE_CODE.UNAUTHORIZED)
        }
        const createNewAccessToken = jwtAccessToken(
            verifiedRefreshToken.email,
            verifiedRefreshToken.userId,
            verifiedRefreshToken.name,
            verifiedRefreshToken.role
        )
        return {
            message: AUTH_MESSAGES.LOGIN_SIGNUP.NEW_TOKEN_CREATED, data: {
                newAccessToken: createNewAccessToken
            },

        }

    }

    /**
     * @param data 
     * Send OTP to email if the email doesnt exists 
     * The data is stored in the redis OTPRepo
     * @returns {message, boolean}
     */

    async sendOTP(data: RegisterUserDTO): Promise<IApiResponse> {

        const findEmail = await this._userRepository.findEmail(data.email);
        if (findEmail) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.EMAIL_ALREADY_EXISTS, RESPONSE_CODE.CONFILT)
        }
        const otp = generateOtp();
        console.log(otp)
        const hashed = await hashPassword(data.password)
        const pendingUser: IUserTemp = {
            full_name: data.full_name,
            email: data.email,
            otp,
            password: hashed
        }
        const value = await this._otpRepository.saveUserData(pendingUser)
        if (!value) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.OTP_SENT_FAIL, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        await sendVerificationEmail(data.email, otp)
        return { message: AUTH_MESSAGES.LOGIN_SIGNUP.OTP_SENT_SUCCESS }
    }


    /**
     * @param email 
     * @param otp 
     * check if the OTP matches the one in the redis use email as key
     * if it matches 
     * @returns {message, boolean, jwtToken}
     */

    async verifyOTP(email: string, otp: string): Promise<IApiResponse<AuthResponseDTO>> {
        const result = await this._otpRepository.getUserData(email);
        if (!result) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.OTP_EXPIRED, RESPONSE_CODE.NOT_FOUND)
        }
        const data: CreateUserDTO = {
            full_name: result.full_name,
            email: result.email,
            password: result.password
        }
        if (result.otp === otp) {
            const newUser = await this._userRepository.createNewUser(data)
            const accessToken = jwtAccessToken(newUser.email, newUser.id, newUser.full_name, newUser.role)
            const refreshToken = jwtRefreshToken(newUser.email, newUser.id, newUser.full_name, newUser.role)
            const respnone = UserMapper.toAuthResponseDTO(newUser, accessToken, refreshToken)
            await this._otpRepository.deleteUserData(newUser.email)
            return { message: AUTH_MESSAGES.LOGIN_SIGNUP.OTP_SUCCESS, data: respnone, statuscode: RESPONSE_CODE.CREATED }
        }
        throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.OTP_INCORRECT, RESPONSE_CODE.BAD_REQUEST)

    }


    /**
     * @param email 
     * Generates a OTP and save the OTP in db (redis)
     * if saved send OTP to email
     * @returns {message, boolean}
     */

    async resendOTP(email: string): Promise<IApiResponse> {
        const findEmail = await this._userRepository.findEmail(email);
        if (findEmail) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.EMAIL_ALREADY_EXISTS, RESPONSE_CODE.CONFILT)
        }
        const otp = generateOtp();
        console.log("new otp: ", otp)
        const saveNewOtp = await this._otpRepository.editUserData(otp, email);
        if (!saveNewOtp) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.OTP_SENT_FAIL, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        await sendVerificationEmail(email, otp);
        return { message: AUTH_MESSAGES.LOGIN_SIGNUP.OTP_SENT_SUCCESS }
    }


    /**
     * @param email
     * check if email exists if so send OTP to the email
     * save the OTP and email in redis for verification 
     * @returns {message, boolean}
     */

    async forgetPasswordOTPSent(email: string): Promise<IApiResponse> {
        const findEmailCheck = await this._userRepository.findEmail(email);
        if (!findEmailCheck) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.EMAIL_NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        const otp = generateOtp()
        console.log(otp, " for forget password")
        const val = this._otpRepository.saveOTP(otp, email);
        if (!val) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.OTP_SENT_FAIL, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        await sendVerificationEmail(email, otp)
        return { message: AUTH_MESSAGES.LOGIN_SIGNUP.OTP_SENT_SUCCESS }

    }


    /**
    * @param email 
    * @param otp 
    * check if the OTP matches the one in the redis use email as key
    * if it matches 
    * @returns {message, boolean, jwtToken}
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
     * @param email
     * check if user exists then send a OTP to the email
     * change the current OTP in reids to the new one
     * and send OTP to email
     * @returns {message, boolean}
     */

    async forgetPasswordResendOTP(email: string): Promise<IApiResponse> {
        const findEmail = await this._userRepository.findEmail(email);
        if (!findEmail) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.EMAIL_NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        const otp = generateOtp();
        console.log(otp, " forget password resend otp")
        const editotp = await this._otpRepository.editOTP(otp, email);
        if (!editotp) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.OTP_SENT_FAIL, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        await sendVerificationEmail(email, otp)
        return { message: AUTH_MESSAGES.LOGIN_SIGNUP.OTP_SENT_SUCCESS }

    }


    /**
     * @param email 
     * @param password
     * check if the email exists then
     * hash the new passowrd
     * send the new password and email to the repo for updation
     * @returns {message, boolean}
     */

    async forgetPasswordChangePassword(email: string, password: string): Promise<IApiResponse> {
        const findEmail = await this._userRepository.findEmail(email);
        if (!findEmail) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.EMAIL_NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        const hashedPassword = await hashPassword(password);
        const value = await this._userRepository.changePassword(email, hashedPassword)
        if (!value) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.PASSWORD_CHANGE_FAIL, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        return { message: AUTH_MESSAGES.LOGIN_SIGNUP.PASSWORD_CHANGE_SUCCESS }
    }


    /**
     * @param email 
     * @param password 
     * find the user using the email
     * if user exists cross check the password then
     * create a jwt token 
     * @returns {message, boolean, jwtToken}
     */

    async login(email: string, password: string): Promise<IApiResponse<AuthResponseDTO>> {
        const user = await this._userRepository.findUser(email);
        if (!user) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.INVALID_CREDENTIALS, RESPONSE_CODE.NOT_FOUND)
        }
        if (user.is_blocked) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.USER_BLOCKED, RESPONSE_CODE.FORBIDDEN)
        }
        if (!user.password) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.GOOGLE_LOGIN_DETECTED, RESPONSE_CODE.BAD_REQUEST)

        }
        const checkPassword = await comparePassword(password, user.password);
        if (!checkPassword) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.INVALID_CREDENTIALS, RESPONSE_CODE.BAD_REQUEST)

        }
        const accessToken = jwtAccessToken(user.email, user.id, user.full_name, user.role);
        const refreshToken = jwtRefreshToken(user.email, user.id, user.full_name, user.role)
        const authResponse = UserMapper.toAuthResponseDTO(user, accessToken, refreshToken)
        return { message: AUTH_MESSAGES.LOGIN_SIGNUP.LOGIN_SUCCESS, data: authResponse }

    }


    /**
     * @param email 
     * @param password 
     * find the user using the email
     * check if user is admin using role field then
     * if user exists cross check the password then
     * create a jwt token 
     * @returns {message, boolean, jwtToken}
     */

    async adminLogin(email: string, password: string): Promise<IApiResponse<AuthResponseDTO>> {
        const admin = await this._userRepository.findUser(email);
        if (!admin) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.NOT_ADMIN, RESPONSE_CODE.BAD_REQUEST)

        }
        if (admin.role !== USER_ROLES.ADMIN) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.NOT_ADMIN, RESPONSE_CODE.BAD_REQUEST)
        }
        const checkPassword = await comparePassword(password, admin.password!);
        if (!checkPassword) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.NOT_ADMIN, RESPONSE_CODE.BAD_REQUEST)
        }
        const accessToken = jwtAccessToken(admin.email, admin.id, admin.full_name, admin.role);
        const refreshToken = jwtRefreshToken(admin.email, admin.id, admin.full_name, admin.role)
        const authResponse = UserMapper.toAuthResponseDTO(admin, accessToken, refreshToken)
        return { message: AUTH_MESSAGES.LOGIN_SIGNUP.LOGIN_SUCCESS, data: authResponse, }

    }

    /**
     * 
     * @param code 
     * exchnage the code of the user data from googleapis
     * create user if user doesnt exists or if user exists send the login credentials
     * @returns {message, boolean, jwtToken}
     * 
     */
    async googleLogin(code: string): Promise<IApiResponse<AuthResponseDTO>> {

        const googleData = await googleLoginResponse(code);

        if (!googleData) {
            throw new AppError(AUTH_MESSAGES.LOGIN_SIGNUP.GOOGLE_DATA_ACCESS_FAIL, RESPONSE_CODE.NOT_FOUND)

        }
        const user = await this._userRepository.findUser(googleData.email);

        if (user) {
            if (user.google_profile_id === googleData.google_profile_id) {
                const access_token = jwtAccessToken(user.email, user.id, user.full_name, user.role)
                const refreshToken = jwtRefreshToken(user.email, user.id, user.full_name, user.role)
                const authResponse = UserMapper.toAuthResponseDTO(user, access_token, refreshToken)

                return { message: AUTH_MESSAGES.LOGIN_SIGNUP.LOGIN_SUCCESS, data: authResponse, }
            }


            const data = await this._userRepository.updateUser(user.id, {
                google_profile_id: googleData.google_profile_id,
                profile_image_url: googleData.profile_image_url,
                full_name: googleData.full_name
            })
            if (data) {
                const access_token = jwtAccessToken(data.email, data.id, data.full_name, data.role)
                const refreshToken = jwtRefreshToken(data.email, data.id, data.full_name, data.role)
                const authResponse =  UserMapper.toAuthResponseDTO(data, access_token, refreshToken)
                return { message: AUTH_MESSAGES.LOGIN_SIGNUP.LOGIN_SUCCESS, data: authResponse, }
            }

        }
        const result = await this._userRepository.createNewUser(googleData);


        const access_token = jwtAccessToken(result.email, result.id, result.full_name, result.role)
        const refreshToken = jwtRefreshToken(result.email, result.id, result.full_name, result.role)
        const authResponse =  UserMapper.toAuthResponseDTO(result, access_token, refreshToken)

        return { message: AUTH_MESSAGES.LOGIN_SIGNUP.LOGIN_SUCCESS, data: authResponse }

    }
}
