export interface IDesignSpaceTypeBenchmark {
    id: string
    spaceType: string
    averageMinPrice: number
    averageMaxPrice: number
    noOfDesigns: number
    lastUpdated: Date
}

export interface SpaceTypeAvg {
    spaceType: string
    averageMinPrice: number
    averageMaxPrice: number
    noOfDesigns: number
}


export interface WarningDTO {
    warnings?: string[]
}
