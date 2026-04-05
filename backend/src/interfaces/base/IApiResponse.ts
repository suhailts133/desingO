export interface IApiResponse<T = null> {
    success: boolean;
    message: string;
    data?: T;
    statuscode: number;
}



export interface IApiResponseWithPagination<T> extends IApiResponse<T> {
    total: number;
    totalPages: number;
}