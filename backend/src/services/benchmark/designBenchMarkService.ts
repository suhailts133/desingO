import type { IApiResponse } from "../../interfaces/base/IApiResponse.js";
import type { SpaceTypeAvg } from "../../interfaces/benchmark/IBenchMark.js";
import type { IDesignBenchMarkRepository } from "../../interfaces/benchmark/IBenchMarkRepository.js";
import type { IDesignBenchMarkService } from "../../interfaces/benchmark/IBenchMarkService.js";
import type { IDesignRepository } from "../../interfaces/designer/IDesignerRepository.js";
import { BENCHMARK_MESSAGES } from "../../shared/messages/benchMarkMessages.js";

export class DesignBenchmarkService implements IDesignBenchMarkService {
    constructor(private _designRepo: IDesignRepository, private _benchMarkRepo: IDesignBenchMarkRepository) { }


    async getNewBenchMark(): Promise<IApiResponse<SpaceTypeAvg[]>> {
        const avgPrices = await this._designRepo.computeAvgPriceBySpaceType();
        await Promise.all(
            avgPrices.map(avg =>
                this._benchMarkRepo.newAvgPriceBySpaceType(avg)
            )
        );

        return { message: BENCHMARK_MESSAGES.DESIGNS.NEW_CALCULATION,data:avgPrices }
    }
}