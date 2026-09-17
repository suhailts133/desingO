import type { DesignDetailResponseDTO, DesignGallaryDTO, GetAllDesignCommonResponseDTO, getAllDesignsResponseDTO } from "../../DTO/designer/designDTO";
import type { IDesign, IDesignPopulated } from "../../interfaces/designer/IDesigner";

export class DesignMapper {


    static toDesignGallaeryDTOList(design: IDesign[]): DesignGallaryDTO[] {
        return design.map(e => ({
            designId: e.id,
            coverImage: e.coverImage.path
        }))
    }

    static toMyDesignsDTOlist(designs: IDesign[]): getAllDesignsResponseDTO[] {
        return designs.map(data => ({
            id: data.id,
            name: data.name,
            activeJobCount: data.activeJobCount,
            coverImage: data.coverImage.path,
            description: data.description,
            minPrice: data.minPrice.toString(),
            maxPrice: data.maxPrice.toString()
        }))
    }
    static toDesignsNotSavedDTOlist(designs: IDesignPopulated[]): GetAllDesignCommonResponseDTO[] {
        return designs.map(data => ({
            id: data.id,
            name: data.name,
            spaceType: data.spaceType,
            designStyles: data.designStyles,
            coverImage: data.coverImage.path,
            minPrice: data.minPrice.toString(),
            maxPrice: data.maxPrice.toString(),
            designerName: data.userId.full_name,
            isSaved: false

        }))
    }
    static toDesignsDTOlist(designs: IDesignPopulated[], saved: Set<string>): GetAllDesignCommonResponseDTO[] {
        return designs.map(data => ({
            id: data.id,
            name: data.name,
            spaceType: data.spaceType,
            designStyles: data.designStyles,
            coverImage: data.coverImage.path,
            minPrice: data.minPrice.toString(),
            maxPrice: data.maxPrice.toString(),
            designerName: data.userId.full_name,
            isSaved: saved.has(data.id)

        }))
    }

    static toDesignDTO(data: IDesignPopulated, saved: Set<string>): DesignDetailResponseDTO {
        return {
            id: data.id,
            designerName: data.userId.full_name,
            designerId: data.userId.id,
            designName: data.name,
            propertyType: data.propertyType,
            spaceType: data.spaceType,
            minPrice: data.minPrice.toString(),
            maxPrice: data.maxPrice.toString(),
            services: data.services,
            description: data.description,
            designStyles: data.designStyles,
            coverImage: data.coverImage,
            gallery: data.gallery,
            createdAt: data.createdAt.toDateString(),
            isSaved: saved.has(data.id)
        }
    }
}