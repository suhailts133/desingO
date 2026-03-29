import type { DesignerVerificationBodyDTO, DesignerVerificationDTO } from "../../DTO/designer/designerVerificationDTOs.js";
import type { IUserRepository } from "../../interfaces/auth/IUserRepository.js";
import type { DesignerVerificationFiles, IEducation, IWorkExperience } from "../../interfaces/designer/IDesigner.js";
import type { IDesignerService } from "../../interfaces/designer/IDesignerService.js";
import type { IApiResponse } from "../../interfaces/base/IApiResponse.js";
import { RESPONSE_CODE } from "../../helpers/enums/statusCode.js";
import { ensureError } from "../../helpers/ensureError.js";
import type { IDesignerRepository } from "../../interfaces/designer/IDesignerRepository.js";
import { sendDesignerVerificationEmail } from "../../helpers/emails/designerVerificationEmail.js";

import type { IImageUploaderService, ImageUploadResult } from "../../interfaces/base/IImageUpload.js";
import { CLOUDINARY_FOLDER_NAME, DESIGNER_STATUS, USER_ROLES } from "../../helpers/enums/commonEnums.js";

export class DesignerService implements IDesignerService {
    constructor(
        private _userRepository: IUserRepository,
        private _designerRepository: IDesignerRepository,
   
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

}