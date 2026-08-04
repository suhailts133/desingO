import type { IApiResponse } from "../base/IApiResponse"
import type { SpaceTypeAvg } from "./IBenchMark"

export interface IDesignBenchMarkService {
    getNewBenchMark(): Promise<IApiResponse<SpaceTypeAvg[]>>
}