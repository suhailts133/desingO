import type { Request, Response } from "express"
import { RespsonseHelper } from "../../shared/helpers/responseHelper.js"
import { RESPONSE_CODE } from "../../shared/enums/statusCode.js"
import type { IDesignService } from "../../interfaces/designer/IDesignerService.js"
import { designValidation, editDesignValidation } from "../../validators/designers/designValidation.js"
import type { AddDesignRequestDTO, DesignFiles, EditDesign, EditDesignFiles } from "../../DTO/designer/designDTO.js"
import asyncHandler from "express-async-handler";
import { AppError } from "../../shared/errors/appError.js"


import { isObjectId } from "../../shared/helpers/extraFunctions.js"
import { DESIGNER_MESSAGES } from "../../shared/messages/designerMessages.js"
import { AUTH_MESSAGES } from "../../shared/messages/authMessages.js"




// handle all design related routes
export class DesignController {

    constructor(private _designService: IDesignService) { }


    /**
     * for posting new design
     * @route POST design/add-design
     * @param req.body {@link AddDesignRequestDTO}
     * @param req.files.coverImage - single image (required)
     * @param req.files.gallery - multiple images (required)
     * @throws {AppError} 400 if there is any issue with req.body
     * @throws {AppError} 401 if user is authenticated
    */
    addDesign = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = designValidation.validate(req.body, { stripUnknown: true })
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }
        const validatedData = value as AddDesignRequestDTO
        const userId = req.user?.userId as string;
        if (!userId) {
            throw new AppError(AUTH_MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }
        const files = req.files as {
            coverImage?: Express.Multer.File[]
            gallery?: Express.Multer.File[]

        }

        if (!files.coverImage?.[0]) {
            throw new AppError(DESIGNER_MESSAGES.DESIGNS.COVER_IMAGE_NOT_FOUND, RESPONSE_CODE.BAD_REQUEST)
        }
        const coverImage = files.coverImage[0];

        if (!files.gallery || files.gallery.length <= 0) {
            throw new AppError(DESIGNER_MESSAGES.DESIGNS.GALLERY_NOT_FOUND, RESPONSE_CODE.BAD_REQUEST)
        }
        const gallery = files.gallery


        const designfiles: DesignFiles = {
            coverImage,
            gallery
        }

        const result = await this._designService.addDesign(userId, validatedData, designfiles)
        RespsonseHelper.success(res, result)
    })


    /**
     * for editing the design
     * @route PATCH design/edit-design/:id
     * @param req.body {@link EditDesign}
     * @param req.params.id- design id  
     * @param req.files.coverImage - single image  
     * @param req.files.gallery - multiple images 
     * @throws {AppError} 400 if there is any issue with req.body or req.parms
    */
    editDesign = asyncHandler(async (req: Request, res: Response) => {
        const { error, value } = editDesignValidation.validate(req.body, { stripUnknown: true })
        if (error) {
            throw new AppError(error.details[0]?.message || "Missing fields or Invalid Data", RESPONSE_CODE.BAD_REQUEST)
        }
        const designId = req.params.id as string;
        if (designId) {
            throw new AppError(DESIGNER_MESSAGES.DESIGNS.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        if (!isObjectId(designId)) {
            throw new AppError(DESIGNER_MESSAGES.DESIGNS.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
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

        const result = await this._designService.editDesign(designId, validatedData, designfiles)
        RespsonseHelper.success(res, result)
    })


    /**
     * for getting design posted by a designer
     * @route GET design/my
     * @param req.query.page - page number
     * @throws {AppError} 401 if user is unauthorized 
    */
    getMyDesigns = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.userId
        if (!userId) {
            throw new AppError(AUTH_MESSAGES.AUTH.UNAUTHORIZED, RESPONSE_CODE.UNAUTHORIZED)
        }
        const { page } = req.query;
        const result = await this._designService.getMyDesigns(userId as string, page as string)
        RespsonseHelper.successWithPagination(res, result)

    })


    /**
     * to get a single design
     * @route GET design/getDesignDetail
     * @param req.parms.id - design id 
     * @throws {AppError} 400 if there is no req.params.id or if its not a objectid 
    */
    getDesignDetail = asyncHandler(async (req: Request, res: Response) => {
        const designId = req.params.id as string;
        if (!designId) {
            throw new AppError(DESIGNER_MESSAGES.DESIGNS.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        if (!isObjectId(designId)) {
            throw new AppError(DESIGNER_MESSAGES.DESIGNS.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        const result = await this._designService.getDesignDetail(designId)
        RespsonseHelper.success(res, result)
    })


    /**
     * to get all designs
     * @route GET design/all-designs
     * @param req.query {@link DesignFilter}
    */
    getAllDesigns = asyncHandler(async (req: Request, res: Response) => {
        const result = await this._designService.getAllDesigns(req.query)
        RespsonseHelper.successWithPagination(res, result)
    })


    /**
     * to delete a desgin
     * @route DELETE design/:id
     * @param req.parms.id - design id 
     * @throws {AppError} 400 if there is no req.params.id or if its not a objectid 
    */
    deleteDesign = asyncHandler(async (req: Request, res: Response) => {
        const designId = req.params.id as string;
        if (!designId) {
            throw new AppError(DESIGNER_MESSAGES.DESIGNS.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        if (!isObjectId(designId)) {
            throw new AppError(DESIGNER_MESSAGES.DESIGNS.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        const result = await this._designService.deleteADesign(designId)
        RespsonseHelper.success(res, result)
    })


    /**
     * to delete a desgin
     * @route GET design/gallery/:id
     * @param req.parms.id - designer id 
     * @param req.query.page - page number
     * @throws {AppError} 400 if there is no req.params.id or if its not a objectid 
    */
    getDesignGallery = asyncHandler(async (req: Request, res: Response) => {
        const designerId = req.params.id as string;
        if (!designerId) {
            throw new AppError(DESIGNER_MESSAGES.DESIGNS.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        if (!isObjectId(designerId)) {
            throw new AppError(DESIGNER_MESSAGES.DESIGNS.ID_REQUIRED, RESPONSE_CODE.BAD_REQUEST)
        }
        const { page } = req.query;
        const result = await this._designService.getDesignGallary(designerId, page as string)
        RespsonseHelper.successWithPagination(res, result)
    })
}