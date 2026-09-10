import type { IApiResponse } from "../api/responseType";

type ApiError = {
    data: IApiResponse<null>;
    status: number;
}

export const UNKNOWN_ERROR: IApiResponse<null> = {
    success: false,
    message: "something went wrong. please try again or contact support",
    statuscode: 500,
};
export function isApiError(error: unknown): error is ApiError {
    return (typeof error === "object" && error !== null && "data" in error && "status" in error);
}