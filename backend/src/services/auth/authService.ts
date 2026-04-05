// Helpers
import generateOtp from "../../helpers/jwt/generateOTP.js";
import sendVerificationEmail from "../../helpers/emails/sendOTP.js";
import { comparePassword, hashPassword } from "../../helpers/hashPassword.js";
import { jwtAccessToken } from "../../helpers/jwt/jsonTokenCreater.js";
import { ensureError } from "../../helpers/errors/ensureError.js";
import { RESPONSE_CODE } from "../../helpers/enums/statusCode.js";
import { jwtRefreshToken, refeshTokenVerificaion } from "../../helpers/jwt/refreshToken.js";
// Interfaces / Repositories
import type { IOTPRepository } from "../../interfaces/auth/IOtpRepository.js";
import type { IAuthService } from "../../interfaces/auth/IAuthService.js";
import type { IUserRepository } from "../../interfaces/auth/IUserRepository.js";
import type { IUserTemp } from "../../interfaces/auth/IUser.js";
import type { IApiResponse } from "../../interfaces/base/IApiResponse.js";
// DTOs
import type { CreateUserDTO, RegisterUserDTO, AuthResponseDTO, RefreshTokenDTO } from "../../DTO/auth/authDTO.js";
import { googleLoginResponse } from "../../helpers/googleAuth.js";



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
        try {
            const verifiedRefreshToken = refeshTokenVerificaion(refreshToken)
            if (!verifiedRefreshToken) {
                return { success: false, message: "Token Expired. Please Login", statuscode: RESPONSE_CODE.UNAUTHORIZED }
            }
            const createNewAccessToken = jwtAccessToken(
                verifiedRefreshToken.email,
                verifiedRefreshToken.userId,
                verifiedRefreshToken.name,
                verifiedRefreshToken.role
            )
            return {
                success: true, message: "New access token created", data: {
                    newAccessToken: createNewAccessToken
                },
                statuscode: RESPONSE_CODE.OK
            }
        } catch (error) {
            const err = ensureError(error)
            console.error(err.message);
            return { success: false, message: "Failed to Generate Refresh Token. Please try again or contact support.", statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR }
        }
    }

    /**
     * @param data 
     * Send OTP to email if the email doesnt exists 
     * The data is stored in the redis OTPRepo
     * @returns {message, boolean}
     */

    async sendOTP(data: RegisterUserDTO): Promise<IApiResponse> {
        try {
            const findEmail = await this._userRepository.findEmail(data.email);
            if (findEmail) {
                return { message: "Email already exsits, please login", success: false, statuscode: RESPONSE_CODE.CONFILT }
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
                return { success: false, message: "Failed to send OTP. Please try again or contact support.", statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR }
            }
            await sendVerificationEmail(data.email, otp)
            return { success: true, message: "OTP has been successfully sent to your email.", statuscode: RESPONSE_CODE.OK }
        } catch (error) {
            const err = ensureError(error)
            console.error(err.message);
            return { success: false, message: "Failed to send OTP. Please try again or contact support.", statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR }
        }
    }


    /**
     * @param email 
     * @param otp 
     * check if the OTP matches the one in the redis use email as key
     * if it matches 
     * @returns {message, boolean, jwtToken}
     */

    async verifyOTP(email: string, otp: string): Promise<IApiResponse<AuthResponseDTO>> {
        try {
            const result = await this._otpRepository.getUserData(email);
            const data: CreateUserDTO = {
                full_name: result.full_name,
                email: result.email,
                password: result.password
            }
            if (result.otp === otp) {
                const val = await this._userRepository.createNewUser(data)
                const accessToken = jwtAccessToken(val.email, val.id, val.full_name, val.role)
                const refreshToken = jwtRefreshToken(val.email, val.id, val.full_name, val.role)
                const respnone: AuthResponseDTO = {
                    user: {
                        id: val.id,
                        name: val.full_name,
                        email: val.email,
                        role: val.role
                    },
                    refreshToken: refreshToken,
                    jwtToken: accessToken
                }
                await this._otpRepository.deleteUserData(val.email!)
                return { success: true, message: "OTP Verification Completed", data: respnone, statuscode: RESPONSE_CODE.CREATED }
            }
            return { message: "Incorrect OTP", success: false, statuscode: RESPONSE_CODE.BAD_REQUEST }
        } catch (error) {
            const err = ensureError(error)
            console.error(err.message);
            return { success: false, message: "Failed to verify OTP. Please try again or contact support.", statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR }
        }
    }


    /**
     * @param email 
     * Generates a OTP and save the OTP in db (redis)
     * if saved send OTP to email
     * @returns {message, boolean}
     */

    async resendOTP(email: string): Promise<IApiResponse> {
        try {
            const findEmail = await this._userRepository.findEmail(email);
            if (findEmail) {
                return { message: "Email already exsits, please login", success: false, statuscode: RESPONSE_CODE.CONFILT }
            }
            const otp = generateOtp();
            console.log("new otp: ", otp)
            const saveNewOtp = await this._otpRepository.editUserData(otp, email);
            if (!saveNewOtp) {
                return { message: "Resend OTP failed. Please sign up again.", success: false, statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR };
            }
            await sendVerificationEmail(email, otp);
            return { message: 'A new OTP has been successfully sent to your email.', success: true, statuscode: RESPONSE_CODE.OK }
        } catch (error) {
            const err = ensureError(error)
            console.error(err.message);
            return { success: false, message: "Failed to resend OTP. Please try again or contact support.", statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR }
        }
    }


    /**
     * @param email
     * check if email exists if so send OTP to the email
     * save the OTP and email in redis for verification 
     * @returns {message, boolean}
     */

    async forgetPasswordOTPSent(email: string): Promise<IApiResponse> {
        try {
            const findEmailCheck = await this._userRepository.findEmail(email);
            if (!findEmailCheck) {
                return { success: false, message: "Email Not Found, Please Signup.", statuscode: RESPONSE_CODE.NOT_FOUND }
            }

            const otp = generateOtp()
            console.log(otp, " for forget password")
            const val = this._otpRepository.saveOTP(otp, email);
            if (!val) {
                throw new Error("Failed to store otp in redis service:forgetPassword")
            }
            await sendVerificationEmail(email, otp)

            return { success: true, message: "OTP sent for password reset.", statuscode: RESPONSE_CODE.OK }
        } catch (error) {
            const err = ensureError(error)
            console.error(err.message);
            return { success: false, message: "Failed to resend OTP. Please try again or contact support.", statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR }
        }
    }


    /**
    * @param email 
    * @param otp 
    * check if the OTP matches the one in the redis use email as key
    * if it matches 
    * @returns {message, boolean, jwtToken}
    */

    async forgetPasswordOTPVerification(email: string, otp: string): Promise<IApiResponse> {
        try {
            const findEmailCheck = await this._userRepository.findEmail(email);
            if (!findEmailCheck) {
                return { success: false, message: "Email Not Found, Please Signup.", statuscode: RESPONSE_CODE.NOT_FOUND }
            }
            const savedOTP = await this._otpRepository.getOTP(email)
            if (savedOTP === null) {
                return { success: false, message: 'OTP has expired. Please request a new one.', statuscode: RESPONSE_CODE.NOT_FOUND }
            }

            const otpChecking = otp === savedOTP
            if (!otpChecking) {
                return { success: otpChecking, message: "Incorrect OTP, Please Try again.", statuscode: RESPONSE_CODE.BAD_REQUEST }
            }
            const deleted = await this._otpRepository.deleteOTP(email);
           if(!deleted){
            console.error("Failed")
           }
            return { success: true, message: "OTP verification successful. Please change your password.", statuscode: RESPONSE_CODE.OK }
        } catch (error) {
            const err = ensureError(error)
            console.error(err.message);
            return { success: false, message: "Failed to verify OTP. Please try again or contact support.", statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR }
        }
    }


    /**
     * @param email
     * check if user exists then send a OTP to the email
     * change the current OTP in reids to the new one
     * and send OTP to email
     * @returns {message, boolean}
     */

    async forgetPasswordResendOTP(email: string): Promise<IApiResponse> {
        try {
            const findEmail = await this._userRepository.findEmail(email);
            if (!findEmail) {
                return { success: false, message: "Email Not Found, Please Signup.", statuscode: RESPONSE_CODE.NOT_FOUND }
            }
            const otp = generateOtp();
            console.log(otp, " forget password resend otp")
            const editotp = await this._otpRepository.editOTP(otp, email);
            if (!editotp) {
                return { message: "Failed to resend OTP. Please try again or contact support.", success: false, statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR }
            }
            await sendVerificationEmail(email, otp)
            return { success: true, message: "OTP for password reset has been resent successfully.", statuscode: RESPONSE_CODE.OK }
        } catch (error) {
            const err = ensureError(error)
            console.error(err.message);
            return { success: false, message: "Failed to resend OTP. Please try again or contact support.", statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR }
        }
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
        try {
            const findEmail = await this._userRepository.findEmail(email);
            if (!findEmail) {
                return { success: false, message: "Email Not Found, Please Signup.", statuscode: RESPONSE_CODE.NOT_FOUND }
            }
            const hashedPassword = await hashPassword(password);
            const value = await this._userRepository.changePassword(email, hashedPassword)
            if (!value) {
                return { success: false, message: "Unable to change the password.", statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR }
            }
            return { success: true, message: "Password changed successfully. Please log in again.", statuscode: RESPONSE_CODE.OK }
        } catch (error) {
            const err = ensureError(error)
            console.error(err.message);
            return { success: false, message: "Failed to change password. Please try again or contact support.", statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR }
        }
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
        try {
            const user = await this._userRepository.findUser(email);
            if (!user) {
                return { success: false, message: "Email Not Found, Please Signup.", statuscode: RESPONSE_CODE.NOT_FOUND };
            }
            if (user.is_blocked) {
                return { success: false, message: "User is blocked. Contact Support", statuscode: RESPONSE_CODE.FORBIDDEN };
            }
            if (!user.password) {
                return { success: false, message: "Did you logged in with google?", statuscode: RESPONSE_CODE.NOT_FOUND };
            }
            const checkPassword = await comparePassword(password, user.password);
            if (!checkPassword) {
                return { success: false, message: "Incorrect password. Please try again.", statuscode: RESPONSE_CODE.BAD_REQUEST };
            }
            const accessToken = jwtAccessToken(user.email, user.id, user.full_name, user.role);
            const refreshToken = jwtRefreshToken(user.email, user.id, user.full_name, user.role)
            const authResponse: AuthResponseDTO = {
                user: {
                    id: user.id,
                    name: user.full_name,
                    email: user.email,
                    role: user.role
                },
                refreshToken: refreshToken,
                jwtToken: accessToken
            }
            return { success: true, message: "Login Successfull.", data: authResponse, statuscode: RESPONSE_CODE.OK }
        } catch (error) {
            const err = ensureError(error)
            console.error(err.message);
            return { success: false, message: "Failed to login. Please try again or contact support.", statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR }
        }
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
        try {
            const admin = await this._userRepository.findUser(email);
            if (!admin) {
                return { success: false, message: "Admin not found.", statuscode: RESPONSE_CODE.NOT_FOUND };
            }
            if (admin.role !== "Admin") {
                return { success: false, message: "Admin not found.", statuscode: RESPONSE_CODE.NOT_FOUND };
            }
            const checkPassword = await comparePassword(password, admin.password!);
            if (!checkPassword) {
                return { success: false, message: "Incorrect password. please try again.", statuscode: RESPONSE_CODE.BAD_REQUEST };
            }
            const accessToken = jwtAccessToken(admin.email, admin.id, admin.full_name, admin.role);
            const refreshToken = jwtRefreshToken(admin.email, admin.id, admin.full_name, admin.role)
            const authResponse: AuthResponseDTO = {
                user: {
                    id: admin.id,
                    name: admin.full_name,
                    email: admin.email,
                    role: admin.role
                },
                refreshToken: refreshToken,
                jwtToken: accessToken
            }
            return { success: true, message: "Admin login successfull.", data: authResponse, statuscode: RESPONSE_CODE.OK }
        } catch (error) {
            const err = ensureError(error)
            console.error(err.message);
            return { success: false, message: "Failed to login. Please try again or contact support.", statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR }
        }
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
        try {
            const googleData = await googleLoginResponse(code);

            if (!googleData) {
                return { success: false, message: "Couldn't get the user data from google.", statuscode: RESPONSE_CODE.NOT_FOUND }
            }
            const user = await this._userRepository.findUser(googleData.email);

            if (user) {
                if (user.google_profile_id === googleData.google_profile_id) {
                    const access_token = jwtAccessToken(user.email, user.id, user.full_name, user.role)
                    const refreshToken = jwtRefreshToken(user.email, user.id, user.full_name, user.role)
                    const authResponse: AuthResponseDTO = {
                        user: {
                            name: user.full_name,
                            email: user.email,
                            role: user.role,
                            id: user.id
                        },
                        refreshToken: refreshToken,
                        jwtToken: access_token,
                    }

                    return { success: true, message: "Google login successfull.", data: authResponse, statuscode: RESPONSE_CODE.OK }
                }


                const data = await this._userRepository.updateUser(user.id, {
                    google_profile_id: googleData.google_profile_id,
                    profile_image_url: googleData.profile_image_url,
                    full_name: googleData.full_name
                })
                if (data) {
                    const access_token = jwtAccessToken(data.email, data.id, data.full_name, data.role)
                    const refreshToken = jwtRefreshToken(data.email, data.id, data.full_name, data.role)
                    const authResponse: AuthResponseDTO = {
                        user: {
                            name: data.full_name,
                            email: data.email,
                            role: data.role,
                            id: data.id
                        },
                        refreshToken: refreshToken,
                        jwtToken: access_token,
                    }

                    return { success: true, message: "Google login successfull.", data: authResponse, statuscode: RESPONSE_CODE.OK }
                }

            }
            const result = await this._userRepository.createNewUser(googleData);


            const access_token = jwtAccessToken(result.email, result.id, result.full_name, result.role)
            const refreshToken = jwtRefreshToken(result.email, result.id, result.full_name, result.role)
            const authResponse: AuthResponseDTO = {
                user: {
                    name: result.full_name,
                    email: result.email,
                    role: result.role,
                    id: result.id
                },
                jwtToken: access_token,
                refreshToken: refreshToken,
            }

            return { success: true, message: "Google login successfull.", data: authResponse, statuscode: RESPONSE_CODE.OK }
        } catch (error) {
            const err = ensureError(error).message
            console.error(err);
            return { success: false, message: err, statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR }
        }
    }
}
