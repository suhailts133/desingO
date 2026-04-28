import type { DesignerVerificationBodyDTO, DesignerVerificationDTO } from "../../DTO/designer/designerVerificationDTOs.js";
import type { IUserRepository } from "../../interfaces/auth/IUserRepository.js";
import type { DesignerVerificationFiles, IEducation, IWorkExperience } from "../../interfaces/designer/IDesigner.js";
import type { IDesignerService } from "../../interfaces/designer/IDesignerService.js";
import type { IApiResponse, IApiResponseWithPagination } from "../../interfaces/base/IApiResponse.js";
import { RESPONSE_CODE } from "../../helpers/enums/statusCode.js";
import type { IDesignerRepository } from "../../interfaces/designer/IDesignerRepository.js";
import { sendDesignerVerificationEmail } from "../../helpers/emails/designerVerificationEmail.js";

import type { IImageUploaderService, ImageUploadResult } from "../../interfaces/base/IImageUpload.js";
import { CLOUDINARY_FOLDER_NAME, DESIGNER_STATUS, USER_ROLES } from "../../helpers/enums/commonEnums.js";
import type { DesignerFilter, DesignerCardDTO } from "../../DTO/designer/designerDTO.js";
import { MESSAGES } from "../../helpers/enums/messages.js";
import { AppError } from "../../helpers/errors/appError.js";

export class DesignerService implements IDesignerService {
    constructor(
        private _userRepository: IUserRepository,
        private _designerRepository: IDesignerRepository,

        private _imageUploder: IImageUploaderService,
    ) { }

    async designerVerification(userId: string, email: string, data: DesignerVerificationBodyDTO, files: DesignerVerificationFiles): Promise<IApiResponse> {
        const user = await this._userRepository.findUser(email)
        if (!user) {
            throw new AppError(MESSAGES.USER.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        if (user.role === USER_ROLES.DESIGNER) {
            throw new AppError(MESSAGES.DESIGNER_VERIFICATION.ALREADY_A_DESIGNER, RESPONSE_CODE.CONFILT)
        }
        const alreadyAppliedForDesigner = await this._designerRepository.getDesigner(userId);


        if (alreadyAppliedForDesigner && alreadyAppliedForDesigner.status === DESIGNER_STATUS.PENDING) {
            throw new AppError(MESSAGES.DESIGNER_VERIFICATION.ALREADY_APPLIED, RESPONSE_CODE.CONFILT)
        }

        const governmentIdImage: ImageUploadResult = await this._imageUploder.upload(files.governmentIdImageFile, CLOUDINARY_FOLDER_NAME.GOVT);
        const educationImages: ImageUploadResult[] = await this._imageUploder.uploadMany(files.educationImagesFiles, CLOUDINARY_FOLDER_NAME.CERTIFICATES)
        const workExperienceImages: ImageUploadResult[] = await this._imageUploder.uploadMany(files.workExperienceImageFiles ?? [], CLOUDINARY_FOLDER_NAME.WORK_PROOF)

        const education: IEducation[] = data.education.map((edu, index) => ({
            ...edu,
            certification: educationImages[index] as ImageUploadResult
        }))

        const workExperience: IWorkExperience[] = (data.workExperience ?? []).map((work, index) => ({
            ...work,
            proof: workExperienceImages[index] as ImageUploadResult
        }))

        const designerData: DesignerVerificationDTO = {
            userId,
            ...data,
            govtIdImage: governmentIdImage,
            education,
            workExperience
        }
        await this._designerRepository.createDesignerRequest(designerData)
        const emailSent = await sendDesignerVerificationEmail(user.email, user.full_name)
        if (!emailSent) {
            return { message: MESSAGES.EMAIL.NOT_SEND }
        }
        return { message: MESSAGES.DESIGNER_VERIFICATION.SUCCESS }

    }

    async getAllDesigners(designerFilter?: DesignerFilter): Promise<IApiResponseWithPagination<DesignerCardDTO[]>> {
        const { data, pagination } = await this._designerRepository.getAllDesigners(designerFilter)
        return { success: true, statuscode: RESPONSE_CODE.OK, message: MESSAGES.DESIGNER.GET_ALL_DESIGNERS, data, total: pagination.total, totalPages: pagination.totalPages }
    }

    async getDesigner(designerId: string): Promise<IApiResponse<DesignerCardDTO>> {
        const [designerDetatils, designerData] = await Promise.all([
            this._designerRepository.getDesigner(designerId),
            this._userRepository.findUserById(designerId)
        ])

        if (!designerData || !designerDetatils) {
            throw new AppError(MESSAGES.DESIGNER.DESIGNER_NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        }
        const data: DesignerCardDTO = {
            designerId: designerData.id,
            full_name: designerData.full_name,
            ...(designerData.profileImage?.path && { profileImg: designerData.profileImage.path }),
            ...(designerData.profile_image_url && { google_profil_img: designerData.profile_image_url }),
            bio: designerDetatils.bio,
            joinedAt: designerDetatils.createdAt.toDateString(),
            state: designerDetatils.state,
            district: designerDetatils.district,
        }
        return { message: MESSAGES.DESIGNER.DESIGNER_FOUND, data }
    }

}