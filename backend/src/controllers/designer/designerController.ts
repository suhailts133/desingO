import type { Request, Response } from "express"
import { designerVeificationDataValidator } from "../../validators/designers/designerVerificationValidator"
import { RespsonseHelper } from "../../shared/helpers/responseHelper"
import { RESPONSE_CODE } from "../../shared/enums/statusCode"
import type { DesignerVerificationBodyDTO } from "../../DTO/designer/designerVerificationDTOs"
import type { DesignerVerificationFiles } from "../../interfaces/designer/IDesigner"
import type { IDesignerService } from "../../interfaces/designer/IDesignerService"
import asyncHandler from "express-async-handler";
import { AppError } from "../../shared/errors/appError"
import { DesignerQueryFilter } from "../../validators/designers/designerValidations"
import { DESIGNER_MESSAGES } from "../../shared/messages/designerMessages"
import { isObjectId } from "../../shared/helpers/extraFunctions"
import { AUTH_MESSAGES } from "../../shared/messages/authMessages"
export class DesignerController {

    constructor(private _designerService: IDesignerService) { }


    getAllDesigners = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = DesignerQueryFilter.validate(req.query, { stripUnknown: true })
        if (error) {
            throw new AppError(error.details[0]?.message || "Invalid query parameters", RESPONSE_CODE.BAD_REQUEST)
        }

        const result = await this._designerService.getAllDesigners(value)
        RespsonseHelper.successWithPagination(res, result)
    })


    getADesigner = asyncHandler(async (req: Request, res: Response) => {
        const designerId = req.params.id as string
        if (!designerId) {
            throw new AppError(DESIGNER_MESSAGES.DESIGNER.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        if (!isObjectId(designerId)) {
            throw new AppError(DESIGNER_MESSAGES.DESIGNER.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        const result = await this._designerService.getDesigner(designerId);
        RespsonseHelper.success(res, result)
    })


    designerVerification = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = designerVeificationDataValidator.validate(req.body, { stripUnknown: true })
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }
        const validatedData = value as DesignerVerificationBodyDTO

        const email = req.user?.email as string;
        const userId = req.user?.userId as string;

        if (!email || !userId) {
            throw new AppError(AUTH_MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.BAD_REQUEST)
        }
        const files = req.files as {
            governmentIdImage?: Express.Multer.File[]
            educationImages?: Express.Multer.File[]
            workExperienceImages?: Express.Multer.File[]
        }

        if (!files.governmentIdImage?.[0]) {
            throw new AppError(DESIGNER_MESSAGES.DESIGNER_VERIFICATION.GOVT_IMAGE_NOT_FOUND, RESPONSE_CODE.BAD_REQUEST)
        }

        const governmentIdImageFile = files.governmentIdImage[0];

        if (!files.educationImages || files.educationImages.length !== validatedData.education.length) {
            throw new AppError(DESIGNER_MESSAGES.DESIGNER_VERIFICATION.CERTIFICATE_NOT_FOUND, RESPONSE_CODE.BAD_REQUEST)
        }

        const educationImagesFiles = files.educationImages


        if (validatedData.workExperience && validatedData.workExperience.length > 0) {
            if (!files.workExperienceImages || files.workExperienceImages.length !== validatedData.workExperience.length) {
                throw new AppError(DESIGNER_MESSAGES.DESIGNER_VERIFICATION.PROOF_NOT_fOUND, RESPONSE_CODE.BAD_REQUEST)
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

    })

}