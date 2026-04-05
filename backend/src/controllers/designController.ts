import type { Request, Response } from "express"
import { ensureError } from "../helpers/errors/ensureError.js"
import { RespsonseHelper } from "../helpers/responseHelper.js"
import { RESPONSE_CODE } from "../helpers/enums/statusCode.js"
import type { IDesignService } from "../interfaces/designer/IDesignerService.js"
import { designValidation } from "../validators/designers/designValidation.js"
import type { AddDesignRequestDTO, DesignFiles } from "../DTO/designer/designDTO.js"

export class DesignController {

    constructor(private _designService: IDesignService) { }
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

            const result = await this._designService.addDesign(userId, validatedData, designfiles)
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
            const result = await this._designService.getAllDesigns(userId as string, page as string)
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
            const result = await this._designService.getDesignDetail(id as string)
            RespsonseHelper.success(res, result)
        } catch (error) {
            const err = ensureError(error).message;
            console.log(err)
            RespsonseHelper.error(res, "Error While Fetching design detail", err, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
    }


    getAllDesignsCommon = async (req: Request, res: Response) => {
        try {
            const result = await this._designService.getAllDesignCommon(req.query)
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
            const result = await this._designService.deleteADesign(id as string)
            RespsonseHelper.success(res, result)
        } catch (error) {
            const err = ensureError(error).message;
            console.log(err)
            RespsonseHelper.error(res, "Error While deleting Design", err, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
    }

}