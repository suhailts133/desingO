import type { Request, Response } from "express"
import { ensureError } from "../helpers/ensureError.js"
import { designerVeificationDataValidator } from "../validators/designers/designerVerificationValidator.js"
import { RespsonseHelper } from "../helpers/responseHelper.js"
import { RESPONSE_CODE } from "../helpers/enums/statusCode.js"
import type { DesignerVerificationBodyDTO } from "../DTO/designer/designerVerificationDTOs.js"
import type { DesignerVerificationFiles } from "../interfaces/designer/IDesigner.js"
import type { IDesignerService } from "../interfaces/designer/IDesignerService.js"


export class DesignerController {

    constructor(private _designerService: IDesignerService) { }


    designerVerificationController = async (req: Request, res: Response) => {
        try {
            const { error, value } = designerVeificationDataValidator.validate(req.body, { stripUnknown: true })
            if (error) {
                const err = error.details[0]?.message || "Missing fields or Invalid Data"
                return RespsonseHelper.error(res, "Invalid data", err, RESPONSE_CODE.BAD_REQUEST)
            }
            const validatedData = value as DesignerVerificationBodyDTO

            const email = req.user?.email as string;
            const userId = req.user?.userId as string;
            console.log("email: ", email)
            console.log("userid: ", userId)
            if (!email || !userId) {
                return RespsonseHelper.error(res, "user not found", "user not found", RESPONSE_CODE.BAD_REQUEST)
            }
            const files = req.files as {
                governmentIdImage?: Express.Multer.File[]
                educationImages?: Express.Multer.File[]
                workExperienceImages?: Express.Multer.File[]
            }

            if (!files.governmentIdImage?.[0]) {
                return RespsonseHelper.error(res, "Invalid data", "Government ID image is required", RESPONSE_CODE.BAD_REQUEST)
            }

            const governmentIdImageFile = files.governmentIdImage[0];

            if (!files.educationImages || files.educationImages.length !== validatedData.education.length) {
                return RespsonseHelper.error(res, "Invalid data", "Certificate image is required for each education entry", RESPONSE_CODE.BAD_REQUEST)
            }

            const educationImagesFiles = files.educationImages


            if (validatedData.workExperience && validatedData.workExperience.length > 0) {
                if (!files.workExperienceImages || files.workExperienceImages.length !== validatedData.workExperience.length) {
                    return RespsonseHelper.error(res, "Invalid data", "Proof image is required for each work experience entry", RESPONSE_CODE.BAD_REQUEST)
                }
            }

            const workExperienceImageFiles = files.workExperienceImages ?? [];


            const designerVerificationFiles: DesignerVerificationFiles = {
                governmentIdImageFile,
                educationImagesFiles,
                workExperienceImageFiles
            }

            const result = await this._designerService.designerVerification(userId, email, validatedData, designerVerificationFiles)

            RespsonseHelper.success(res, result)

        } catch (error) {
            const err = ensureError(error).message;
            console.log(err)
            RespsonseHelper.error(res, "Error While Verifying designer", err, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
    }

}