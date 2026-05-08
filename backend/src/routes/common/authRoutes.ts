import { Router } from "express";
import { OtpRepository } from "../../repositories/auth/OTPRepository.js";
import { AuthService } from "../../services/auth/authService.js";
import { AuthController } from "../../controllers/common/AuthController.js";
import { UserRepository } from "../../repositories/auth/userRepository.js";
import { RefreshTokenRepositoy } from "../../repositories/auth/refreshTokenRepository.js";
import { BlackListRepository } from "../../repositories/auth/blacklistRepository.js";

const router = Router()


const otpRepository = new OtpRepository()
const userRepository = new UserRepository()
const refreshTokenRepo = new RefreshTokenRepositoy()
const blackListRepo = new BlackListRepository()
const authService = new AuthService(otpRepository, userRepository, refreshTokenRepo, blackListRepo);
const authController = new AuthController(authService)

router.post("/signup", authController.register)
router.post("/verify-otp", authController.verifyOTP)
router.post("/resend-otp", authController.resendOTP)
router.post("/forgetPassword", authController.forgetPassword)
router.post("/forgetPassword-verify-otp", authController.forgetPasswordOTPVerification)
router.post("/forgetPassword-resend-otp", authController.forgetPasswordResentOTP)
router.post("/forgetPassword-change-password", authController.forgetPasswordChangePassword)
router.post("/login", authController.login)
router.post("/admin-login", authController.adminLogin)
router.post("/google", authController.googleLogin)
router.post("/refresh", authController.refreshToken)

export default router