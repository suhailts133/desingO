import type { Request, Response } from "express"
import { ensureError } from "../helpers/ensureError.js"
import { designerVeificationDataValidator } from "../validators/designers/designerVerificationValidator.js"
import { RespsonseHelper } from "../helpers/responseHelper.js"
import { RESPONSE_CODE } from "../helpers/enums/statusCode.js"
import type { DesignerVerificationBodyDTO } from "../DTO/designer/designerVerificationDTOs.js"
import type { DesignerVerificationFiles } from "../interfaces/designer/IDesigner.js"
import type { IDesignerService } from "../interfaces/designer/IDesignerService.js"
import { designValidation } from "../validators/designers/designValidation.js"
import type { AddDesignRequestDTO, DesignFiles } from "../DTO/designer/designDTO.js"

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

    addDesign = async (req: Request, res: Response) => {
        try {
            const { error, value } = designValidation.validate(req.body, { stripUnknown: true })
            if (error) {
                const err = error.details[0]?.message || "Missing fields or Invalid Data"
                return RespsonseHelper.error(res, "Invalid data", err, RESPONSE_CODE.BAD_REQUEST)
            }
            const validatedData = value as AddDesignRequestDTO
            const userId = req.user?.userId as string;
            if (!userId) {
                return RespsonseHelper.error(res, "user not found", "user not found", RESPONSE_CODE.BAD_REQUEST)
            }
            const files = req.files as {
                coverImage?: Express.Multer.File[]
                gallery?: Express.Multer.File[]

            }

            if (!files.coverImage?.[0]) {
                return RespsonseHelper.error(res, "Invalid data", "Cover image is required", RESPONSE_CODE.BAD_REQUEST)
            }

            const coverImage = files.coverImage[0];
            if (!files.gallery || files.gallery.length <= 0) {
                return RespsonseHelper.error(res, "Invalid data", "Image gallery is required", RESPONSE_CODE.BAD_REQUEST)
            }

            const gallery = files.gallery



            const designfiles: DesignFiles = {
                coverImage,
                gallery
            }

            const result = await this._designerService.addDesign(userId, validatedData, designfiles)
            RespsonseHelper.success(res, result)

        } catch (error) {
            const err = ensureError(error).message;
            console.log(err)
            RespsonseHelper.error(res, "Error While Adding new design", err, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
    }

    getAllDesigns = async (req: Request, res: Response) => {
        try {
            console.log(req.user)
            const userId = req.user?.userId
            if (!userId) {
                RespsonseHelper.error(res, "user not found", "user not found", RESPONSE_CODE.INTERNAL_SERVER_ERROR)
            }
            const { page } = req.query;
            const result = await this._designerService.getAllDesigns(userId as string, page as string)
            RespsonseHelper.successWithPagination(res, result)
        } catch (error) {
            const err = ensureError(error).message;
            console.log(err)
            RespsonseHelper.error(res, "Error While Fetching all designs", err, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
    }

    getDesignDetail = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!id) {
                return RespsonseHelper.error(res, "design id is required", "Missing id in params", RESPONSE_CODE.BAD_REQUEST);
            }
            const result = await this._designerService.getDesignDetail(id as string)
            RespsonseHelper.success(res, result)
        } catch (error) {
            const err = ensureError(error).message;
            console.log(err)
            RespsonseHelper.error(res, "Error While Fetching design detail", err, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
    }


    getAllDesignsCommon = async (req: Request, res: Response) => {
        try {
            const result = await this._designerService.getAllDesignCommon(req.query)
            RespsonseHelper.successWithPagination(res, result)
        } catch (error) {
            const err = ensureError(error).message;
            console.log(err)
            RespsonseHelper.error(res, "Error While Fetching all designs", err, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
    }



    deleteADesign = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!id) {
                return RespsonseHelper.error(res, "Design id is required", "Missing id in params", RESPONSE_CODE.BAD_REQUEST);
            }
            console.log(id, "ddd")
            const result = await this._designerService.deleteADesign(id as string)
            RespsonseHelper.success(res, result)
        } catch (error) {
            const err = ensureError(error).message;
            console.log(err)
            RespsonseHelper.error(res, "Error While deleting Design", err, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
    }

}