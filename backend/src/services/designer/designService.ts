import { RESPONSE_CODE } from "../../helpers/enums/statusCode.js";
import type { IApiResponse, IApiResponseWithPagination } from "../../interfaces/base/IApiResponse.js";
import type { IDesignRepository } from "../../interfaces/designer/IDesignerRepository.js";
import type { IDesignService } from "../../interfaces/designer/IDesignerService.js";
import type { AddDesignRequestDTO, createDesignDTO, DesignDetailResponseDTO, DesignFiles, DesignFilter, DesignGallaryDTO, EditDesign, EditDesignFiles, EditDesignRepoData, GetAllDesignCommonResponseDTO, getAllDesignsResponseDTO } from "../../DTO/designer/designDTO.js";
import type { IImageUploaderService, ImageUploadResult } from "../../interfaces/base/IImageUpload.js";
import { CLOUDINARY_FOLDER_NAME } from "../../helpers/enums/commonEnums.js";
import { ensureError } from "../../helpers/errors/ensureError.js";
import { MESSAGES } from "../../helpers/enums/messages.js";
import { AppError } from "../../helpers/errors/appError.js";

export class DesignService implements IDesignService {

    constructor(private _designRepository: IDesignRepository, private _imageUploder: IImageUploaderService,) { }

    async editDesign(designId: string, data: EditDesign, files?: EditDesignFiles): Promise<IApiResponse> {
        const design = await this._designRepository.getDesign(designId);
        if (!design) {
            throw new AppError(MESSAGES.DESIGNS.DESIGN_NOT_FOUND, RESPONSE_CODE.NOT_FOUND);
        }

        let coverImage: ImageUploadResult | undefined = undefined;

        if (files?.coverImage) {

            await this._imageUploder.delete(design.coverImage.filename);
            coverImage = await this._imageUploder.upload(files.coverImage, CLOUDINARY_FOLDER_NAME.COVER_IMAGES);
        }

        const keptFilenames = new Set((data.keptGallery ?? []).map(img => img.filename));


        const imagesToDelete = design.gallery
            .filter(img => !keptFilenames.has(img.filename))
            .map(img => img.filename);

        if (imagesToDelete.length > 0) {
            await this._imageUploder.deleteMany(imagesToDelete);
        }

        let newGallery: ImageUploadResult[] | undefined = undefined;

        if (files?.gallery && files.gallery.length > 0) {
            newGallery = await this._imageUploder.uploadMany(files.gallery, CLOUDINARY_FOLDER_NAME.GALLERY);
        }

        const finalGallery: ImageUploadResult[] = [
            ...(data.keptGallery ?? []),
            ...(newGallery ?? []),
        ];

        const designRepoData: EditDesignRepoData = {
            name: data.name,
            description: data.description,
            designStyles: data.designStyles,
            services: data.services,
            spaceType: data.spaceType,
            startingPrice: data.startingPrice,
            propertyType: data.propertyType,
        }

        const result = await this._designRepository.editDesign(designId, designRepoData, coverImage, finalGallery);
        if (!result) {
            throw new AppError(MESSAGES.DESIGNS.UPDATION_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
        }

        return { message: MESSAGES.DESIGNS.UPDATION_SUCCESS };
    }

    async getDesignGallary(designerId: string, page?: string): Promise<IApiResponseWithPagination<DesignGallaryDTO[]>> {
        const { data, pagination } = await this._designRepository.getAllDesigns(designerId, page)
        const output: DesignGallaryDTO[] = data?.map(d => {
            return {
                coverImage: d.coverImage,
                designId: d.id
            }
        })
        return { message: MESSAGES.DESIGNS.GET_ALL_DESIGNS, data: output, total: pagination.total, totalPages: pagination.totalPages }
    }

    async addDesign(userId: string, data: AddDesignRequestDTO, files: DesignFiles): Promise<IApiResponse> {

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
            throw new AppError(MESSAGES.DESIGNS.DESIGN_CREATE_FAIL, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        return { message: MESSAGES.DESIGNS.DESIGN_CREATE_SUCCESS }
    }

    async getMyDesigns(userId: string, page?: string): Promise<IApiResponseWithPagination<getAllDesignsResponseDTO[]>> {
        try {
            const { data, pagination } = await this._designRepository.getAllDesigns(userId, page)
            // console.log(result, "cls")
            return {
                success: true,
                message: "Designs fetching sucessfull",
                statuscode: RESPONSE_CODE.OK,
                data: data,
                total: pagination.total,
                totalPages: pagination.totalPages

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


    async getAllDesigns(designFilter?: DesignFilter): Promise<IApiResponseWithPagination<GetAllDesignCommonResponseDTO[]>> {
        try {
            const result = await this._designRepository.getAllDesignCommon(designFilter)

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
        const design = await this._designRepository.getDesign(id);
        if (!design) {
            throw new AppError(MESSAGES.DESIGNS.DESIGN_NOT_FOUND, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        await Promise.all([
            this._imageUploder.delete(design.coverImage.filename),
            this._imageUploder.deleteMany(design.gallery.map(e => e.filename))
        ])

        const result = await this._designRepository.deleteADesign(id);
        if (!result) {
            throw new AppError(MESSAGES.DESIGNS.DELETION_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        return { message: MESSAGES.DESIGNS.DELETION_SUCCESS };
    }
}