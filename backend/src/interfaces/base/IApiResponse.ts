export interface IApiResponse<T = null> {
    success?: boolean;
    message: string;
    data?: T;
    statuscode?: number;
}



export interface IApiResponseWithPagination<T> extends IApiResponse<T> {
    total: number;
    totalPages: number;
}

export interface IApiResponseWithRecomendation<T> extends IApiResponse<T> {
    DataType: "JOB" | "DESIGN";
    type: "RECOMENDED" | "RECENT";
}


export type sortByTypes = "newest" | "oldest" | "name_asc" | "name_desc";