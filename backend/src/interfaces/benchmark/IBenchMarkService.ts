import type { IApiResponse } from "../base/IApiResponse.js"
import type { SpaceTypeAvg } from "./IBenchMark.js"

export interface IDesignBenchMarkService {
    getNewBenchMark(): Promise<IApiResponse<SpaceTypeAvg[]>>
}