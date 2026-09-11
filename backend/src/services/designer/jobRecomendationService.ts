import type { JobsCommonResponseDTO } from "../../DTO/user/jobsDTO";
import { JobRequestMapper } from "../../dtoMappers/user/jobRequestMapper";
import type { IUserRepository } from "../../interfaces/auth/IUserRepository";
import type { IApiResponseWithRecomendation } from "../../interfaces/base/IApiResponse";
import type { IJobRepository } from "../../interfaces/customer/ICustomerRepository";
import type { IDesignerInteractionRepository } from "../../interfaces/designer/IDesignerRepository";
import type { IDesignerInteractionService } from "../../interfaces/designer/IDesignerService";
import { RECOMENDATION_DATA_TYPE, RECOMENDATION_TYPE } from "../../shared/enums/commonEnums";
import { cosineSimilarity } from "../../shared/helpers/cosineSimilarity";
import { JOB_MESSAGES } from "../../shared/messages/jobMessages";

export class JobRecomendationService implements IDesignerInteractionService {
    constructor(private _interactionRepo: IDesignerInteractionRepository, private _jobRepo: IJobRepository, private _userRepo: IUserRepository) { }

    async _getDesignerTasteVector(designerId: string): Promise<number[] | null> {
        const interactions = await this._interactionRepo.getRecentInteractios(designerId)
        const usable = interactions.filter(i => i.jobId.embedding.length > 0);
        if (usable.length === 0) return null
        const [firstJob] = usable;
        if (!firstJob) return null
        const dims = firstJob.jobId.embedding.length
        const taste: number[] = new Array(dims).fill(0)
        let totalWeight = 0;

        for (const interaction of usable) {
            const vec = interaction.jobId.embedding;
            for (let d = 0; d < dims; d++) {
                taste[d] = (taste[d] ?? 0) + (vec[d] ?? 0) * interaction.weight;
            }
            totalWeight += interaction.weight
        }
        return taste.map(v => v / totalWeight)
    }

    async getRecomendedJobs(designerId: string): Promise<IApiResponseWithRecomendation<JobsCommonResponseDTO[]>> {
        const [interactionTaste, designer] = await Promise.all([
            this._getDesignerTasteVector(designerId),
            this._userRepo.findUserById(designerId)
        ]);

        const preferenceEmbedding = designer?.embedding?.length ? designer.embedding : null;

        let taste: number[] | null = null;
        if (interactionTaste && preferenceEmbedding) {
            taste = this._combineVectors(interactionTaste, preferenceEmbedding, 0.7, 0.3);
        } else if (interactionTaste) {
            taste = interactionTaste;
        } else if (preferenceEmbedding) {
            taste = preferenceEmbedding;
        }



        if (!taste) {
            const jobs = await this._jobRepo.findMostRecent();
            const jobData = JobRequestMapper.toJobRequestsDTOlist(jobs);
            return { message: JOB_MESSAGES.JOB_REQUEST.RECENT, data: jobData, type: RECOMENDATION_TYPE.RECENT, DataType: RECOMENDATION_DATA_TYPE.JOB };
        }

        const candidates = await this._jobRepo.findCandidatesExcluding();
        const scored = candidates
            .map(d => ({ design: d, score: cosineSimilarity(taste, d.embedding) }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
            .map(s => s.design);
    
        const recomendedJobs = JobRequestMapper.toJobRequestsDTOlist(scored);
        return { message: JOB_MESSAGES.JOB_REQUEST.RECOMENDED, data: recomendedJobs, type: RECOMENDATION_TYPE.RECOMMENDED, DataType: RECOMENDATION_DATA_TYPE.JOB };
    }


    private _combineVectors(a: number[], b: number[], weightA: number, weightB: number): number[] {
        const dims = Math.max(a.length, b.length);
        const combined = new Array(dims).fill(0);
        for (let d = 0; d < dims; d++) {
            combined[d] = (a[d] ?? 0) * weightA + (b[d] ?? 0) * weightB;
        }
        return combined;
    }
}

