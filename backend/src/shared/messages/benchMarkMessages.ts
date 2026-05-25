export const BENCHMARK_MESSAGES = {

    DESIGNS: {
        NEW_CALCULATION:"new average prices calculated successfully. ",
        MAX_PRICE_EXCEEDED: (inputMaxPrice: number, maxAllowed: number, spaceType: string, averageMaxPrice: number) => `Your maximum price ($${inputMaxPrice}) exceeds the standard market threshold. For a ${spaceType} plan, the maximum competitive rate recommended is $${Math.round(maxAllowed)} (Average: $${averageMaxPrice}).`,
        MIN_PRICE_EXCEEDED: (inputMinPrice: number,minAllowed: number,spaceType: string,averageMinPrice: number) =>`Your minimum price ($${inputMinPrice}) significantly below marketplace standards. For a ${spaceType} plan, the minimum competitive rate recommended is $${Math.round(minAllowed)} (Average: $${averageMinPrice}).`,

    },

} as const