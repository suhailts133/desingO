import type { Request, Response } from "express"
import { RespsonseHelper } from "../helpers/responseHelper.js"
import { RESPONSE_CODE } from "../helpers/enums/statusCode.js"
import type { IDesignService } from "../interfaces/designer/IDesignerService.js"
import { designValidation, editDesignValidation } from "../validators/designers/designValidation.js"
import type { AddDesignRequestDTO, DesignFiles, EditDesign, EditDesignFiles } from "../DTO/designer/designDTO.js"
import asyncHandler from "express-async-handler";
import { AppError } from "../helpers/errors/appError.js"
import { MESSAGES } from "../helpers/enums/messages.js"

export class DesignController {

    constructor(private _designService: IDesignService) { }

    addDesign = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = designValidation.validate(req.body, { stripUnknown: true })
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }
        const validatedData = value as AddDesignRequestDTO
        const userId = req.user?.userId as string;
        if (!userId) {
            throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }
        const files = req.files as {
            coverImage?: Express.Multer.File[]
            gallery?: Express.Multer.File[]

        }

        if (!files.coverImage?.[0]) {
            throw new AppError(MESSAGES.DESIGNS.COVER_IMAGE_NOT_FOUND, RESPONSE_CODE.BAD_REQUEST)
        }
        const coverImage = files.coverImage[0];

        if (!files.gallery || files.gallery.length <= 0) {
            throw new AppError(MESSAGES.DESIGNS.GALLERY_NOT_FOUND, RESPONSE_CODE.BAD_REQUEST)
        }
        const gallery = files.gallery


        const designfiles: DesignFiles = {
            coverImage,
            gallery
        }

        const result = await this._designService.addDesign(userId, validatedData, designfiles)
        RespsonseHelper.success(res, result)
    })

    editDesign = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = editDesignValidation.validate(req.body, { stripUnknown: true })
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }
        const { id } = req.params;
        if (!id) {
            throw new AppError(MESSAGES.DESIGNS.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        const validatedData = value as EditDesign
        const files = req.files as {
            coverImage?: Express.Multer.File[]
            gallery?: Express.Multer.File[]
        }
        const coverImage = files.coverImage?.[0]
        const gallery = files.gallery;

        const designfiles: EditDesignFiles = {
            ...(coverImage && { coverImage }),
            ...(gallery && { gallery }),
        }
        
        const result = await this._designService.editDesign(id as string, validatedData, designfiles)
        RespsonseHelper.success(res, result)
    })


    getAllDesigns = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.userId
        if (!userId) {
            throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }
        const { page } = req.query;
        const result = await this._designService.getMyDesigns(userId as string, page as string)
        RespsonseHelper.successWithPagination(res, result)

    })

    getDesignDetail = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            throw new AppError(MESSAGES.DESIGNS.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        const result = await this._designService.getDesignDetail(id as string)
        RespsonseHelper.success(res, result)
    })


    getAllDesignsCommon = asyncHandler(async (req: Request, res: Response) => {
        const result = await this._designService.getAllDesigns(req.query)
        RespsonseHelper.successWithPagination(res, result)
    })


    deleteADesign = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            throw new AppError(MESSAGES.DESIGNS.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        const result = await this._designService.deleteADesign(id as string)
        RespsonseHelper.success(res, result)
    })



    getDesignGallary = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params
        if (!id) {
            throw new AppError(MESSAGES.DESIGNS.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        const { page } = req.query;
        const result = await this._designService.getDesignGallary(id as string, page as string)
        RespsonseHelper.successWithPagination(res, result)
    })
}