import type { GetAllDesignCommonResponseDTO } from "../../DTO/designer/designDTO";
import { DesignMapper } from "../../dtoMappers/designer/designMapper";
import type { IUserRepository } from "../../interfaces/auth/IUserRepository";
import type {  IApiResponseWithRecomendation } from "../../interfaces/base/IApiResponse";
import type { ICustomerInteractionRepository } from "../../interfaces/customer/ICustomerRepository";
import type { ICustomerInteractionService } from "../../interfaces/customer/ICustomerService";
import type { IDesignRepository } from "../../interfaces/designer/IDesignerRepository";
import { RECOMENDATION_DATA_TYPE, RECOMENDATION_TYPE } from "../../shared/enums/commonEnums";
import { cosineSimilarity } from "../../shared/helpers/cosineSimilarity";
import { DESIGNER_MESSAGES } from "../../shared/messages/designerMessages";

export class DesignRecomendationService implements ICustomerInteractionService {
    constructor(private _userRepo: IUserRepository, private _interactionRepo: ICustomerInteractionRepository, private _designRepo: IDesignRepository) { }

    async _getCustomerTasteVector(customerId: string): Promise<number[] | null> {
        const interactions = await this._interactionRepo.getRecentInteractios(customerId)
        const usable = interactions.filter(i => i.designId.embedding.length > 0);
        if (usable.length === 0) return null
        const [firstDesign] = usable;
        if (!firstDesign) return null
        const dims = firstDesign.designId.embedding.length
        const taste: number[] = new Array(dims).fill(0)
        let totalWeight = 0;

        for (const interaction of usable) {
            const vec = interaction.designId.embedding;
            for (let d = 0; d < dims; d++) {
                taste[d] = (taste[d] ?? 0) + (vec[d] ?? 0) * interaction.weight;
            }
            totalWeight += interaction.weight
        }
        return taste.map(v => v / totalWeight)
    }

    async getRecomendedDesigns(customerId: string): Promise<IApiResponseWithRecomendation<GetAllDesignCommonResponseDTO[]>> {
        const user = await this._userRepo.findUserById(customerId);
        const savedIds = user?.savedDesigns.map(id => id.toString()) ?? [];

        const taste = await this._getCustomerTasteVector(customerId);

        if (!taste) {
            const savedDesignsSet = new Set(savedIds);
            const designs = await this._designRepo.findMostRecent(10);
            const designData = DesignMapper.toDesignsDTOlist(designs, savedDesignsSet);
            return { message: DESIGNER_MESSAGES.DESIGNS.RECENT, data: designData, type:RECOMENDATION_TYPE.RECENT, DataType:RECOMENDATION_DATA_TYPE.DESIGN};
        }

        const candidates = await this._designRepo.findCandidatesExcluding(savedIds);
        const scored = candidates
            .map(d => ({ design: d, score: cosineSimilarity(taste, d.embedding) }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
            .map(s => s.design);

        const recomendedDesigns = DesignMapper.toDesignsNotSavedDTOlist(scored);
        return { message: DESIGNER_MESSAGES.DESIGNS.RECOMENDED, data: recomendedDesigns, type:RECOMENDATION_TYPE.RECOMMENDED, DataType:RECOMENDATION_DATA_TYPE.DESIGN };
    }
}

