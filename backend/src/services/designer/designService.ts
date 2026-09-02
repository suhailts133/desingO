import { RESPONSE_CODE } from "../../shared/enums/statusCode";
import type { IApiResponse, IApiResponseWithPagination, IApiResponseWithRecomendation } from "../../interfaces/base/IApiResponse";
import type { IDesignRepository } from "../../interfaces/designer/IDesignerRepository";
import type { IDesignService } from "../../interfaces/designer/IDesignerService";
import type { AddDesignRequestDTO, createDesignDTO, DesignDetailResponseDTO, DesignFiles, DesignFilter, DesignGallaryDTO, EditDesign, EditDesignFiles, EditDesignRepoData, GetAllDesignCommonResponseDTO, getAllDesignsResponseDTO } from "../../DTO/designer/designDTO";
import type { IImageUploaderService, ImageUploadResult } from "../../interfaces/base/IImageUpload";
import { AVG_PRICE, CLOUDINARY_FOLDER_NAME, RECOMENDATION_DATA_TYPE, RECOMENDATION_TYPE } from "../../shared/enums/commonEnums";
import { AppError } from "../../shared/errors/appError";
import { DESIGNER_MESSAGES } from "../../shared/messages/designerMessages";
import { DesignMapper } from "../../dtoMappers/designer/designMapper";
import type { IUserRepository } from "../../interfaces/auth/IUserRepository";
import type { IDesignBenchMarkRepository } from "../../interfaces/benchmark/IBenchMarkRepository";
import type { WarningDTO } from "../../interfaces/benchmark/IBenchMark";
import { BENCHMARK_MESSAGES } from "../../shared/messages/benchMarkMessages";
import { generateEmbedding } from "../../shared/helpers/embedding";
import type { ICustomerInteractionRepository } from "../../interfaces/customer/ICustomerRepository";
import { DESIGIN_INTERACTION_TYPE, DESIGN_INTERACTION } from "../../shared/enums/interactionEnum";
import { USER_TYPE } from "../../shared/enums/proposalEnums";

export class DesignService implements IDesignService {

    constructor(private _interactionRepo: ICustomerInteractionRepository, private _designRepository: IDesignRepository, private _imageUploder: IImageUploaderService, private _userRepo: IUserRepository, private _designBenchMarkRepo: IDesignBenchMarkRepository) { }

    async getRecentDesigns(): Promise<IApiResponseWithRecomendation<GetAllDesignCommonResponseDTO[]>> {
        const designs = await this._designRepository.findMostRecent(10)
        const designData = DesignMapper.toDesignsNotSavedDTOlist(designs);
        return { message: DESIGNER_MESSAGES.DESIGNS.RECENT, data: designData, type: RECOMENDATION_TYPE.RECENT, DataType: RECOMENDATION_DATA_TYPE.DESIGN }
    }
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
            minPrice: data.minPrice,
            maxPrice: data.maxPrice,
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

    async addDesign(userId: string, data: AddDesignRequestDTO, files: DesignFiles): Promise<IApiResponse<WarningDTO>> {

        const coverImage: ImageUploadResult = await this._imageUploder.upload(files.coverImage, CLOUDINARY_FOLDER_NAME.COVER_IMAGES)
        const gallery: ImageUploadResult[] = await this._imageUploder.uploadMany(files.gallery, CLOUDINARY_FOLDER_NAME.GALLERY)
        const benchmark = await this._designBenchMarkRepo.getAvgPriceBySpaceType(data.spaceType);
        const warnings: string[] = []

        if (benchmark) {
            const max = benchmark.averageMaxPrice * AVG_PRICE.UPPER
            const min = benchmark.averageMinPrice * AVG_PRICE.LOWER

            if (data.maxPrice > max) {
                warnings.push(BENCHMARK_MESSAGES.DESIGNS.MAX_PRICE_EXCEEDED(data.maxPrice, max, benchmark.spaceType, benchmark.averageMaxPrice));
            }
            if (data.minPrice < min) {
                warnings.push(BENCHMARK_MESSAGES.DESIGNS.MIN_PRICE_EXCEEDED(data.minPrice, min, benchmark.spaceType, benchmark.averageMinPrice));
            }
        }
        const embeddingText = `${data.propertyType} ${data.name} ${data.designStyles.join(" ")} ${data.spaceType}`;
        const embedding = await generateEmbedding(embeddingText);
        const designData: createDesignDTO = {
            userId,
            ...data,
            coverImage,
            gallery,
            embedding: embedding ?? []
        }
        const result = await this._designRepository.createDesign(designData)
        if (!result) {
            throw new AppError(DESIGNER_MESSAGES.DESIGNS.DESIGN_CREATE_FAIL, RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        }
        return { message: DESIGNER_MESSAGES.DESIGNS.DESIGN_CREATE_SUCCESS, data: { warnings } }
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

    async getDesignDetail(designId: string, userId?: string): Promise<IApiResponse<DesignDetailResponseDTO>> {
        const [design, user] = await Promise.all([
            this._designRepository.getDesign(designId),
            userId ? this._userRepo.findUserById(userId) : null
        ])
        if (!design) {
            throw new AppError(DESIGNER_MESSAGES.DESIGNS.DESIGN_NOT_FOUND, RESPONSE_CODE.NOT_FOUND)

        }
        if (user && user.role === USER_TYPE.CUSTOMER) {
            console.log(user.full_name)
            const interaciton = await this._interactionRepo.createInteraction({
                customerId: user.id,
                designId,
                action: DESIGIN_INTERACTION_TYPE.VIEW,
                weight: DESIGN_INTERACTION.VIEW
            })
            console.log(interaciton)
        }
        const savedDesignsSet = new Set(user?.savedDesigns.map(id => id.toString()) ?? [])
        const designData = DesignMapper.toDesignDTO(design, savedDesignsSet)
        return { message: DESIGNER_MESSAGES.DESIGNS.DESIGN_DETAIL_SUCCESS, data: designData }

    }


    async getAllDesigns(userId?: string, designFilter?: DesignFilter): Promise<IApiResponseWithPagination<GetAllDesignCommonResponseDTO[]>> {
        const [designs, user] = await Promise.all([
            this._designRepository.getAllDesigns(designFilter),
            userId ? this._userRepo.findUserById(userId) : null
        ])
        const savedDesignsSet = new Set(user?.savedDesigns.map(id => id.toString()) ?? [])
        const designData = DesignMapper.toDesignsDTOlist(designs.data, savedDesignsSet)
        return {
            message: DESIGNER_MESSAGES.DESIGNS.GET_ALL_DESIGNS,
            data: designData,
            total: designs.pagination.total,
            totalPages: designs.pagination.totalPages
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