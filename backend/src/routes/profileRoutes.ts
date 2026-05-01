import { Router } from "express";
import authenticate from "../middlewares/auth.js";
import { DesignerRepository } from "../repositories/designer/designerRepository.js";
import { UserRepository } from "../repositories/auth/userRepository.js";
import { ProfileService } from "../services/common/profileService.js";
import { ProfileController } from "../controllers/common/profileController.js";
import { ProfileImageController } from "../controllers/common/profileImageController.js";
import { ProfileImageService } from "../services/common/profileImageService.js";
import { ProfileImageRepository } from "../repositories/common/profileImageRepository.js";
import { CloudinaryService } from "../services/common/cloudinaryService.js";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

const router = Router()

const desingerRepo = new DesignerRepository()
const userRepo = new UserRepository()
const profileImageRepository = new ProfileImageRepository()

const profileService  = new ProfileService(desingerRepo, userRepo)
const imageUploadService = new CloudinaryService()
const profileImageService = new ProfileImageService(profileImageRepository, imageUploadService)

const profileController = new ProfileController(profileService)
const profileImageController = new ProfileImageController(profileImageService)



router.get("/designer", authenticate, profileController.getDesignerProfile)
router.get("/user", authenticate, profileController.getUserProfile)
router.patch("/designer", authenticate, profileController.updateDesignerProfle)
router.patch("/user", authenticate, profileController.updateUserProfile)
router.patch("/change-profile-image", authenticate, upload.single("profileImageFile"), profileImageController.changeProfileImage)
export default router