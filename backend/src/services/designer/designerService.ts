import type { DesignerVerificationBodyDTO, DesignerVerificationDTO } from "../../DTO/designer/designerVerificationDTOs.js";
import type { IUserRepository } from "../../interfaces/auth/IUserRepository.js";
import type { DesignerVerificationFiles, IEducation, IWorkExperience } from "../../interfaces/designer/IDesigner.js";
import type { IDesignerService } from "../../interfaces/designer/IDesignerService.js";
import type { IApiResponse, IApiResponseWithPagination } from "../../interfaces/base/IApiResponse.js";
import { RESPONSE_CODE } from "../../helpers/enums/statusCode.js";
import { ensureError } from "../../helpers/ensureError.js";
import type { IDesignerRepository, IDesignRepository } from "../../interfaces/designer/IDesignerRepository.js";
import { sendDesignerVerificationEmail } from "../../helpers/emails/designerVerificationEmail.js";
import type { AddDesignRequestDTO, createDesignDTO, DesignDetailResponseDTO, DesignFiles, DesignFilter, GetAllDesignCommonResponseDTO, getAllDesignsResponseDTO } from "../../DTO/designer/designDTO.js";
import type { IImageUploaderService, ImageUploadResult } from "../../interfaces/base/IImageUpload.js";
import { CLOUDINARY_FOLDER_NAME, DESIGNER_STATUS, USER_ROLES } from "../../helpers/enums/commonEnums.js";

export class DesignerService implements IDesignerService {
    constructor(
        private _userRepository: IUserRepository,
        private _designerRepository: IDesignerRepository,
        private _designRepository: IDesignRepository,
        private _imageUploder: IImageUploaderService,
    ) { }

    async designerVerification(userId: string, email: string, data: DesignerVerificationBodyDTO, files: DesignerVerificationFiles): Promise<IApiResponse> {
        try {
            const user = await this._userRepository.findUser(email)
            if (!user) {
                return { statuscode: RESPONSE_CODE.NOT_FOUND, message: "User doesn't exist, Please Sign up.", success: false }
            }
            if (user.role === USER_ROLES.DESIGNER) {
                return { statuscode: RESPONSE_CODE.CONFILT, message: "You are already a designer.", success: false }
            }
            const alreadyAppliedForDesigner = await this._designerRepository.getDesigner(userId);


            if (alreadyAppliedForDesigner && alreadyAppliedForDesigner.status === DESIGNER_STATUS.PENDING) {
                return { statuscode: RESPONSE_CODE.CONFILT, message: "Already applied for the designer position. Please check your email.", success: false }
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
                return { statuscode: RESPONSE_CODE.OK, message: "Email failed to send but application was saved successfully", success: true }
            }
            return { statuscode: RESPONSE_CODE.OK, message: "Form has been submitted. Check email for confirmation", success: true }
        } catch (error) {
            const err = ensureError(error).message
            console.log(err)
            return { statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR, message: "Something went wrong, during designer verificaiton, contact support", success: false }
        }
    }


    async addDesign(userId: string, data: AddDesignRequestDTO, files: DesignFiles): Promise<IApiResponse> {
        try {
            const coverImage: ImageUploadResult = await this._imageUploder.upload(files.coverImage, CLOUDINARY_FOLDER_NAME.COVER_IMAGES)
            const gallery: ImageUploadResult[] = await this._imageUploder.uploadMany(files.gallery, CLOUDINARY_FOLDER_NAME.GALLERY)

            const designData: createDesignDTO = {
                userId,
                ...data,
                coverImage,
                gallery
            }
            const result = await this._designRepository.createDesign(designData)
            if (!result) {
                return {
                    success: false,
                    message: "Could not create design. Contact Support",
                    statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR
                }
            }
            return {
                success: true,
                message: "Design Created Successfully",
                statuscode: RESPONSE_CODE.OK
            }
        } catch (error) {
            const err = ensureError(error)
            console.log(err)
            return { statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR, message: "Something went wrong while adding design contact support", success: false }
        }
    }

    async getAllDesigns(userId: string, page?: string): Promise<IApiResponseWithPagination<getAllDesignsResponseDTO[]>> {
        try {
            const result = await this._designRepository.getAllDesigns(userId, page)
            // console.log(result, "cls")
            return {
                success: true,
                message: "Designs fetching sucessfull",
                statuscode: RESPONSE_CODE.OK,
                data: result.data,
                total: result.pagination.total,
                totalPages: result.pagination.totalPages

            }
        } catch (error) {
            const err = ensureError(error)
            console.log(err)
            return { statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR, message: "Something went wrong while fetching designs. Please try again or contact support", success: false, total: 0, totalPages: 0 }
        }
    }

    async getDesignDetail(designId: string): Promise<IApiResponse<DesignDetailResponseDTO>> {
        try {
            const result = await this._designRepository.getDesignDetail(designId);
            if (!result) {
                return { statuscode: RESPONSE_CODE.NOT_FOUND, message: "Design not found", success: false }
            }
            return { statuscode: RESPONSE_CODE.OK, message: "Design detail fetched successfully", success: true, data: result }
        } catch (error) {
            const err = ensureError(error)
            console.log(err)
            return { statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR, message: "Something went wrong while fetching design detail. Please try again or contact support", success: false }
        }
    }


    async getAllDesignCommon(designFilter?: DesignFilter): Promise<IApiResponseWithPagination<GetAllDesignCommonResponseDTO[]>> {
        try {
            const result = await this._designRepository.getAllDesignCommon(designFilter)
            // console.log(result, "cls")
            return {
                success: true,
                message: "Designs fetching sucessfull",
                statuscode: RESPONSE_CODE.OK,
                data: result.data,
                total: result.pagination.total,
                totalPages: result.pagination.totalPages

            }
        } catch (error) {
            const err = ensureError(error)
            console.log(err)
            return { statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR, message: "Something went wrong while fetching designs. Please try again or contact support", success: false, total: 0, totalPages: 0 }
        }
    }


     async deleteADesign(id: string): Promise<IApiResponse> {
        try {
            const result = await this._designRepository.deleteADesign(id);
            if (!result) {
                return { success: false, statuscode: RESPONSE_CODE.NO_CONTENT, message: "Design Not found." };
            }
            return { success: true, statuscode: RESPONSE_CODE.OK, message: "Design deletion successfully.", };
        } catch (error) {
            const err = ensureError(error)
            console.log(err)
            return { statuscode: RESPONSE_CODE.INTERNAL_SERVER_ERROR, message: "Something went wrong while deleting Design. Please try again or contact support", success: false }
        }
    }
}