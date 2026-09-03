export const JOB_REQUEST_FILTERS = {
    LATEST: "jobRequest_latest",
    OLDEST: "jobRequest_oldest",
    PRICE_INCREASING: "price_asc",
    PRICE_DECREASING: "price_desc",
    AZ: "az",
    ZA: "za"
} as const


export enum TRANSACTION_REPORT_GROUP_TYPE {
    DAY = "day",
    WEEK = "week",
    MONTH = "month",
    YEAR = "year",
    CUSTOM = "custom",
}