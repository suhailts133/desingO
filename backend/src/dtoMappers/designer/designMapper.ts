import type { DesignDetailResponseDTO, GetAllDesignCommonResponseDTO, getAllDesignsResponseDTO } from "../../DTO/designer/designDTO";
import type { IDesign, IDesignPopulated } from "../../interfaces/designer/IDesigner";

export class DesignMapper {
    static toMyDesignsDTOlist(designs: IDesign[]): getAllDesignsResponseDTO[] {
        return designs.map(data => ({
            id: data.id,
            name: data.name,
            coverImage: data.coverImage.path,
            description: data.description,
            minPrice: data.minPrice.toString(),
            maxPrice: data.maxPrice.toString()
        }))
    }
    static toDesignsDTOlist(designs: IDesignPopulated[], saved: Set<string>): GetAllDesignCommonResponseDTO[] {
        return designs.map(data => ({
            id: data.id,
            name: data.name,
            spaceType: data.spaceType,
            designStyles: data.designStyles,
            coverImage: data.coverImage.path,
            minPrice:data.minPrice.toString(),
            maxPrice:data.maxPrice.toString(),
            designerName: data.userId.full_name,
            isSaved: saved.has(data.id)

        }))
    }

    static toDesignDTO(data: IDesignPopulated, saved: Set<string>): DesignDetailResponseDTO {
        return {
            id: data.id,
            designerName: data.userId.full_name,
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