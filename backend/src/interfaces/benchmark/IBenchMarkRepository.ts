import type { IDesignSpaceTypeBenchmark, SpaceTypeAvg } from "./IBenchMark";

export interface IDesignBenchMarkRepository {
    getAvgPriceBySpaceType(spaceType:string):Promise<IDesignSpaceTypeBenchmark | null>   
    newAvgPriceBySpaceType(data:SpaceTypeAvg):Promise<IDesignSpaceTypeBenchmark | null>   
}