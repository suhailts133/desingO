import type { IDesignSpaceTypeBenchmark, SpaceTypeAvg } from "../../interfaces/benchmark/IBenchMark";
import type { IDesignBenchMarkRepository } from "../../interfaces/benchmark/IBenchMarkRepository";
import { DesignBenchmarkModel } from "../../models/benchmarks/DesignBenchMarkModel";
import { BaseRepository } from "../baseRepository";

export class DesignBenchMarkRepository extends BaseRepository<IDesignSpaceTypeBenchmark> implements IDesignBenchMarkRepository {
  
    constructor() {
        super(DesignBenchmarkModel)
    }

    async getAvgPriceBySpaceType(spaceType: string): Promise<IDesignSpaceTypeBenchmark | null> {
        return this.findOne({ spaceType })
    }


    async newAvgPriceBySpaceType(data: SpaceTypeAvg): Promise<IDesignSpaceTypeBenchmark | null> {

        return this._model.findOneAndUpdate(
            { spaceType: data.spaceType },

            {
                $set: {
                    averageMinPrice: data.averageMinPrice,
                    averageMaxPrice: data.averageMaxPrice,
                    noOfDesigns: data.noOfDesigns,
                    lastUpdated: new Date(),
                }
            },

            {
                upsert: true,
                new: true,

            }
        );
    }


}