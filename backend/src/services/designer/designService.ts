import { RESPONSE_CODE } from "../../helpers/enums/statusCode.js";
import type { IApiResponse, IApiResponseWithPagination } from "../../interfaces/base/IApiResponse.js";
import type { IDesignRepository } from "../../interfaces/designer/IDesignerRepository.js";
import type { IDesignService } from "../../interfaces/designer/IDesignerService.js";
import type { AddDesignRequestDTO, createDesignDTO, DesignDetailResponseDTO, DesignFiles, DesignFilter, GetAllDesignCommonResponseDTO, getAllDesignsResponseDTO } from "../../DTO/designer/designDTO.js";
import type { IImageUploaderService, ImageUploadResult } from "../../interfaces/base/IImageUpload.js";
import { CLOUDINARY_FOLDER_NAME } from "../../helpers/enums/commonEnums.js";
import { ensureError } from "../../helpers/errors/ensureError.js";
export class DesignService implements IDesignService {

    constructor(private _designRepository: IDesignRepository, private _imageUploder: IImageUploaderService,) { }

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