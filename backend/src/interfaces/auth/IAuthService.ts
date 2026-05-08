import type { RegisterUserDTO, AuthResponseDTO,RefreshTokenDTO } from "../../DTO/auth/authDTO.js";
import type { IApiResponse } from "../base/IApiResponse.js";


export interface IAuthService {
    sendOTP(data: RegisterUserDTO): Promise<IApiResponse>;
    verifyOTP(email: string, otp: string): Promise<IApiResponse<AuthResponseDTO>>
    resendOTP(email: string): Promise<IApiResponse>;
    forgetPasswordOTPSent(email: string): Promise<IApiResponse>
    forgetPasswordOTPVerification(email: string, otp: string): Promise<IApiResponse>
    forgetPasswordResendOTP(email: string): Promise<IApiResponse>
    forgetPasswordChangePassword(email: string, password: string, jti:string, exp:number): Promise<IApiResponse>
    login(email: string, password: string): Promise<IApiResponse<AuthResponseDTO>>
    adminLogin(email: string, password: string): Promise<IApiResponse<AuthResponseDTO>>
    googleLogin(code:string):Promise<IApiResponse<AuthResponseDTO>>
    refreshToken(refreshToken:string):Promise<IApiResponse<RefreshTokenDTO>>

}