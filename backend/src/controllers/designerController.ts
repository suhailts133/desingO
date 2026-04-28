import type { Request, Response } from "express"
import { designerVeificationDataValidator } from "../validators/designers/designerVerificationValidator.js"
import { RespsonseHelper } from "../helpers/responseHelper.js"
import { RESPONSE_CODE } from "../helpers/enums/statusCode.js"
import type { DesignerVerificationBodyDTO } from "../DTO/designer/designerVerificationDTOs.js"
import type { DesignerVerificationFiles } from "../interfaces/designer/IDesigner.js"
import type { IDesignerService } from "../interfaces/designer/IDesignerService.js"
import asyncHandler from "express-async-handler";
import { AppError } from "../helpers/errors/appError.js"
import { DesignerQueryFilter } from "../validators/designers/designerValidations.js"
import { MESSAGES } from "../helpers/enums/messages.js"

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
        const { id } = req.params
        if (!id) {
            throw new AppError(MESSAGES.DESIGNER.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        console.log(id)
        const result = await this._designerService.getDesigner(id as string);
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
            throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.BAD_REQUEST)
        }
        const files = req.files as {
            governmentIdImage?: Express.Multer.File[]
            educationImages?: Express.Multer.File[]
            workExperienceImages?: Express.Multer.File[]
        }

        if (!files.governmentIdImage?.[0]) {
            throw new AppError(MESSAGES.DESIGNER_VERIFICATION.GOVT_IMAGE_NOT_FOUND, RESPONSE_CODE.BAD_REQUEST)
        }

        const governmentIdImageFile = files.governmentIdImage[0];

        if (!files.educationImages || files.educationImages.length !== validatedData.education.length) {
            throw new AppError(MESSAGES.DESIGNER_VERIFICATION.CERTIFICATE_NOT_FOUND, RESPONSE_CODE.BAD_REQUEST)
        }

        const educationImagesFiles = files.educationImages


        if (validatedData.workExperience && validatedData.workExperience.length > 0) {
            if (!files.workExperienceImages || files.workExperienceImages.length !== validatedData.workExperience.length) {
                throw new AppError(MESSAGES.DESIGNER_VERIFICATION.PROOF_NOT_fOUND, RESPONSE_CODE.BAD_REQUEST)
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