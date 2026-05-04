import { RESPONSE_CODE } from "../../shared/enums/statusCode.js";
import type { IApiResponse, IApiResponseWithPagination } from "../../interfaces/base/IApiResponse.js";
import type { IDesignRepository } from "../../interfaces/designer/IDesignerRepository.js";
import type { IDesignService } from "../../interfaces/designer/IDesignerService.js";
import type { AddDesignRequestDTO, createDesignDTO, DesignDetailResponseDTO, DesignFiles, DesignFilter, DesignGallaryDTO, EditDesign, EditDesignFiles, EditDesignRepoData, GetAllDesignCommonResponseDTO, getAllDesignsResponseDTO } from "../../DTO/designer/designDTO.js";
import type { IImageUploaderService, ImageUploadResult } from "../../interfaces/base/IImageUpload.js";
import { CLOUDINARY_FOLDER_NAME } from "../../shared/enums/commonEnums.js";
import { AppError } from "../../shared/errors/appError.js";
import { DESIGNER_MESSAGES } from "../../shared/messages/designerMessages.js";
import { DesignMapper } from "../../dtoMappers/designer/designMapper.js";

export class DesignService implements IDesignService {

    constructor(private _designRepository: IDesignRepository, private _imageUploder: IImageUploaderService,) { }

    async editDesign(designId: string, data: EditDesign, files?: EditDesignFiles): Promise<IApiResponse> {
        const design = await this._designRepository.getDesign(designId);
        if (!design) {
            throw new AppError(DESIGNER_MESSAGES.DESIGNS.DESIGN_NOT_FOUND, RESPONSE_CODE.NOT_FOUND);
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
            throw new AppError(DESIGNER_MESSAGES.DESIGNS.UPDATION_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR);
        }

        return { message: DESIGNER_MESSAGES.DESIGNS.UPDATION_SUCCESS };
    }

    async getDesignGallary(designerId: string, page?: string): Promise<IApiResponseWithPagination<DesignGallaryDTO[]>> {
        const { data, pagination } = await this._designRepository.getMyDesigns(designerId, page)
        const output: DesignGallaryDTO[] = data.map(d => ({ coverImage: d.coverImage.path, designId: d.id }))
        return { message: DESIGNER_MESSAGES.DESIGNS.GET_ALL_DESIGNS, data: output, total: pagination.total, totalPages: pagination.totalPages }
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
            throw new AppError(DESIGNER_MESSAGES.DESIGNS.DESIGN_CREATE_FAIL, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        return { message: DESIGNER_MESSAGES.DESIGNS.DESIGN_CREATE_SUCCESS }
    }

    async getMyDesigns(userId: string, page?: string): Promise<IApiResponseWithPagination<getAllDesignsResponseDTO[]>> {
        const { data, pagination } = await this._designRepository.getMyDesigns(userId, page)
        const designData = DesignMapper.toMyDesignsDTOlist(data)
        return {
            message: DESIGNER_MESSAGES.DESIGNS.GET_ALL_DESIGNS,
            data: designData,
            total: pagination.total,
            totalPages: pagination.totalPages

        }

    }

    async getDesignDetail(designId: string): Promise<IApiResponse<DesignDetailResponseDTO>> {

        const result = await this._designRepository.getDesign(designId);
        if (!result) {
            throw new AppError(DESIGNER_MESSAGES.DESIGNS.DESIGN_NOT_FOUND, RESPONSE_CODE.NOT_FOUND)

        }
        const designData = DesignMapper.toDesignDTO(result)
        return { message: DESIGNER_MESSAGES.DESIGNS.DESIGN_DETAIL_SUCCESS, data: designData }

    }


    async getAllDesigns(designFilter?: DesignFilter): Promise<IApiResponseWithPagination<GetAllDesignCommonResponseDTO[]>> {
        const result = await this._designRepository.getAllDesigns(designFilter)
        const designData = DesignMapper.toDesignsDTOlist(result.data)
        return {
            message: DESIGNER_MESSAGES.DESIGNS.GET_ALL_DESIGNS,
            data: designData,
            total: result.pagination.total,
            totalPages: result.pagination.totalPages

        }

    }


    async deleteADesign(id: string): Promise<IApiResponse> {
        const design = await this._designRepository.getDesign(id);
        if (!design) {
            throw new AppError(DESIGNER_MESSAGES.DESIGNS.DESIGN_NOT_FOUND, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        await Promise.all([
            this._imageUploder.delete(design.coverImage.filename),
            this._imageUploder.deleteMany(design.gallery.map(e => e.filename))
        ])

        const result = await this._designRepository.deleteADesign(id);
        if (!result) {
            throw new AppError(DESIGNER_MESSAGES.DESIGNS.DELETION_FAILED, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        return { message: DESIGNER_MESSAGES.DESIGNS.DELETION_SUCCESS };
    }
}