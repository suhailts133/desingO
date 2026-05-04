import type { DesignDetailResponseDTO, GetAllDesignCommonResponseDTO, getAllDesignsResponseDTO } from "../../DTO/designer/designDTO.js";
import type { IDesign, IDesignPopulated } from "../../interfaces/designer/IDesigner.js";

export class DesignMapper {
    static toMyDesignsDTOlist(designs: IDesign[]): getAllDesignsResponseDTO[] {
        return designs.map(data => ({
            id: data.id,
            name: data.name,
            coverImage: data.coverImage.path,
            description: data.description,
            price: data.startingPrice
        }))
    }
    static toDesignsDTOlist(designs: IDesignPopulated[]): GetAllDesignCommonResponseDTO[] {
        return designs.map(data => ({
            id: data.id,
            name: data.name,
            spaceType: data.spaceType,
            designStyles: data.designStyles,
            coverImage: data.coverImage.path,
            budget: data.startingPrice,
            designerName: data.userId.full_name
        }))
    }
    static toDesignDTO(data: IDesignPopulated): DesignDetailResponseDTO {
        return {
            id: data.id,
            designerName: data.userId.full_name,
            designName: data.name,
            propertyType: data.propertyType,
            spaceType: data.spaceType,
            startingPrice: data.startingPrice,
            services: data.services,
            description: data.description,
            designStyles: data.designStyles,
            coverImage: data.coverImage,
            gallery: data.gallery,
            createdAt: data.createdAt.toDateString()
        }
    }
}