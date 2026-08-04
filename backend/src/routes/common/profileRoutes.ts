import { Router } from "express";
import authenticate from "../../middlewares/auth";
import { DesignerRepository } from "../../repositories/designer/designerRepository";
import { UserRepository } from "../../repositories/auth/userRepository";
import { ProfileService } from "../../services/common/profileService";
import { ProfileController } from "../../controllers/common/profileController";
import { ProfileImageController } from "../../controllers/common/profileImageController";
import { ProfileImageService } from "../../services/common/profileImageService";
import { CloudinaryService } from "../../services/common/cloudinaryService";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

const router = Router()

const desingerRepo = new DesignerRepository()
const userRepo = new UserRepository()


const profileService  = new ProfileService(desingerRepo, userRepo)
const imageUploadService = new CloudinaryService()
const profileImageService = new ProfileImageService(userRepo, imageUploadService)

const profileController = new ProfileController(profileService)
const profileImageController = new ProfileImageController(profileImageService)



router.get("/designer", authenticate, profileController.getDesignerProfile)
router.get("/user", authenticate, profileController.getUserProfile)
router.patch("/designer", authenticate, profileController.updateDesignerProfle)
router.patch("/user", authenticate, profileController.updateUserProfile)
router.patch("/change-profile-image", authenticate, upload.single("profileImageFile"), profileImageController.changeProfileImage)
export default router