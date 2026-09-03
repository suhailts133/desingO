import type { JobsCommonResponseDTO } from "../../DTO/user/jobsDTO";
import { JobRequestMapper } from "../../dtoMappers/user/jobRequestMapper";
import type { IApiResponseWithRecomendation } from "../../interfaces/base/IApiResponse";
import type { IJobRepository } from "../../interfaces/customer/ICustomerRepository";
import type { IDesignerInteractionRepository } from "../../interfaces/designer/IDesignerRepository";
import type { IDesignerInteractionService } from "../../interfaces/designer/IDesignerService";
import { RECOMENDATION_DATA_TYPE, RECOMENDATION_TYPE } from "../../shared/enums/commonEnums";
import { cosineSimilarity } from "../../shared/helpers/cosineSimilarity";
import { JOB_MESSAGES } from "../../shared/messages/jobMessages";

export class JobRecomendationService implements IDesignerInteractionService {
    constructor(private _interactionRepo: IDesignerInteractionRepository, private _jobRepo: IJobRepository) { }

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

    async getRecomendedJobs(desigenrId: string): Promise<IApiResponseWithRecomendation<JobsCommonResponseDTO[]>> {
        const taste = await this._getDesignerTasteVector(desigenrId);

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
}

